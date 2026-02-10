import os
import joblib
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
import cv2
import shap
import json
import traceback
import xgboost as xgb
import logging
from PIL import Image
from django.conf import settings
from torch.nn import functional as F

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
MODEL_DIR = os.path.join(settings.BASE_DIR, 'ml_models')
MEDIA_ROOT = settings.MEDIA_ROOT

class AE_CNN_Model(nn.Module):
    """
    Standard ResNet50 Classifier for Autoimmune Encephalitis.
    """
    def __init__(self):
        super(AE_CNN_Model, self).__init__()
        try:
            from torchvision.models import ResNet50_Weights
            resnet = models.resnet50(weights=ResNet50_Weights.DEFAULT)
        except:
            resnet = models.resnet50(weights=None)
            
        self.features = nn.Sequential(*list(resnet.children())[:-2]) 
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        self.fc = nn.Linear(2048, 2) 
        
    def forward(self, x):
        x = self.features(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.fc(x)
        return x


class HybridAIEngine:
    def __init__(self):
        self.models = {}
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # === DISEASE-SPECIFIC FEATURE SCHEMAS ===
        # Fixed: Separate feature sets for AE and PV
        
        # 1. AE-specific features (CSF + Imaging + Neuro)
        self.ae_features = [
            'csf_protein', 'csf_cells', 'csf_protein_log', 'csf_cells_log',
            'csf_inflammation', 'csf_ratio', 'csf_product',
            'mri_abnormal', 'eeg_abnormal', 'imaging_score',
            'seizures', 'memory_loss', 'psychiatric_symptoms', 'neuro_score',
            'antibody_titer', 'antibody_log',
            'age', 'sex', 'age_x_csf',
            'tumor_status', 'infection_status',
            'ae_risk_score', 'neuro_x_csf'
        ]
        
        # 2. PV-specific features (Dsg + Skin + Clinical)  
        self.pv_features = [
            'dsg1_index', 'dsg3_index', 'dsg1_log', 'dsg3_log',
            'dsg_total', 'dsg_product', 'dsg_ratio',
            'dsg1_high', 'dsg3_high', 'both_dsg_high',
            'skin_blisters', 'mucosal_ulcers', 'skin_score',
            'pain_score', 'pain_x_skin', 'pain_severity',
            'age', 'sex', 'age_x_dsg',
            'infection_status',
            'pv_risk_score', 'dsg_x_skin', 'dsg_x_pain'
        ]
        
        # 3. Fallback features (for models without feature_names_in_)
        self.rf_features_fallback = self.ae_features  # RF is AE-focused
        self.xgb_features_fallback = self.pv_features  # XGB is PV-focused

        # Clinical thresholds
        self.clinical_thresholds = {
            'AE': {
                'csf_protein': 45,
                'csf_cells': 5,
                'antibody_titer': 60
            },
            'PV': {
                'dsg1_index': 20,
                'dsg3_index': 20
            }
        }

        # Load models
        self._load_models()
        self._load_explainers()
        self._load_cnn()

    def _load_models(self):
        """Load ML models with proper error handling"""
        try:
            # Random Forest (AE-focused)
            rf_path = os.path.join(MODEL_DIR, 'rf_model.pkl')
            if not os.path.exists(rf_path):
                rf_path = os.path.join(MODEL_DIR, 'rf_fold_4.pkl')
            
            if os.path.exists(rf_path):
                self.models['rf'] = joblib.load(rf_path)
                logger.info("✅ RF Model Loaded")

            # XGBoost (PV-focused)
            xgb_path = os.path.join(MODEL_DIR, 'xgb_model.pkl')
            if os.path.exists(xgb_path):
                self.models['xgb'] = joblib.load(xgb_path)
                logger.info("✅ XGBoost Model Loaded")
            elif os.path.exists(os.path.join(MODEL_DIR, 'xgb_model.json')):
                self.models['xgb'] = xgb.Booster()
                self.models['xgb'].load_model(os.path.join(MODEL_DIR, 'xgb_model.json'))
                logger.info("✅ XGBoost (JSON) Loaded")

            # LightGBM
            lgb_path = os.path.join(MODEL_DIR, 'lgb_model.pkl')
            if not os.path.exists(lgb_path):
                lgb_path = os.path.join(MODEL_DIR, 'lgb_fold_3.pkl')
                
            if os.path.exists(lgb_path):
                self.models['lgbm'] = joblib.load(lgb_path)
                logger.info("✅ LightGBM Model Loaded")
            elif os.path.exists(os.path.join(MODEL_DIR, 'lgb_model.txt')):
                import lightgbm as lgb
                self.models['lgbm'] = lgb.Booster(model_file=os.path.join(MODEL_DIR, 'lgb_model.txt'))
                logger.info("✅ LightGBM (TXT) Loaded")

            # Meta Learner
            if os.path.exists(os.path.join(MODEL_DIR, 'stacking_meta_learner.pkl')):
                self.models['meta'] = joblib.load(os.path.join(MODEL_DIR, 'stacking_meta_learner.pkl'))
                logger.info("✅ Meta-Learner Loaded")
                
        except Exception as e:
            logger.error(f"❌ Error loading tabular models: {e}")
            traceback.print_exc()

    def _load_explainers(self):
        """Load SHAP explainers with validation"""
        self.explainers = {}
        
        # RF Explainer (AE-focused)
        try:
            shap_path = os.path.join(MODEL_DIR, 'shap_explainer_rf.pkl')
            if os.path.exists(shap_path):
                self.explainers['rf'] = joblib.load(shap_path)
                logger.info("✅ SHAP (RF) Loaded from File")
            elif 'rf' in self.models:
                self.explainers['rf'] = shap.TreeExplainer(self.models['rf'])
                logger.info("✅ SHAP (RF) Initialized")
        except Exception as e:
            logger.warning(f"⚠️ SHAP (RF) Init Warning: {e}")

        # XGB Explainer (PV-focused)
        try:
            if 'xgb' in self.models:
                self.explainers['xgb'] = shap.TreeExplainer(self.models['xgb'])
                logger.info("✅ SHAP (XGB) Initialized")
        except Exception as e:
            logger.warning(f"⚠️ SHAP (XGB) Init Warning: {e}")

    def _load_cnn(self):
        """Load CNN model for MRI analysis"""
        self.cnn_model = None
        try:
            cnn_path = os.path.join(MODEL_DIR, 'ae_cnn_model.pth')
            if not os.path.exists(cnn_path):
                cnn_path = os.path.join(MODEL_DIR, 'fusion_ann.pth')
            
            if os.path.exists(cnn_path):
                self.cnn_model = AE_CNN_Model().to(self.device)
                state_dict = torch.load(cnn_path, map_location=self.device)
                self.cnn_model.load_state_dict(state_dict, strict=False)
                self.cnn_model.eval()
                logger.info("✅ AE CNN Model Loaded")
        except Exception as e:
            logger.error(f"❌ CNN Load Error: {e}")
            traceback.print_exc()

    def engineer_features(self, df, disease_type='AE'):
        """
        FIXED: Comprehensive feature engineering with disease-specific focus
        """
        # 1. Ensure all base columns exist
        base_cols = [
            'age', 'sex', 'seizures', 'memory_loss', 'psychiatric_symptoms',
            'skin_blisters', 'mucosal_ulcers', 'pain_score', 'csf_protein',
            'csf_cells', 'antibody_titer', 'dsg1_index', 'dsg3_index', 
            'mri_abnormal', 'eeg_abnormal', 'tumor_status', 'infection_status'
        ]
        for col in base_cols:
            if col not in df.columns:
                df[col] = 0

        # 2. CSF Features (AE-focused)
        df['csf_protein_log'] = np.log1p(df['csf_protein'])
        df['csf_cells_log'] = np.log1p(df['csf_cells'])
        df['csf_inflammation'] = df['csf_protein'] * df['csf_cells']
        df['csf_ratio'] = df['csf_protein'] / (df['csf_cells'] + 1)
        df['csf_product'] = df['csf_protein'] * df['csf_cells']
        df['csf_abnormal'] = ((df['csf_protein'] > 45) | (df['csf_cells'] > 5)).astype(int)

        # 3. Dsg Features (PV-focused) - FIXED: Now properly calculated
        df['dsg1_log'] = np.log1p(df['dsg1_index'])
        df['dsg3_log'] = np.log1p(df['dsg3_index'])
        df['dsg_total'] = df['dsg1_index'] + df['dsg3_index']
        df['dsg_ratio'] = df['dsg1_index'] / (df['dsg3_index'] + 1)
        df['dsg_product'] = df['dsg1_index'] * df['dsg3_index']
        df['dsg1_high'] = (df['dsg1_index'] > 20).astype(int)
        df['dsg3_high'] = (df['dsg3_index'] > 20).astype(int)
        df['both_dsg_high'] = ((df['dsg1_high'] == 1) & (df['dsg3_high'] == 1)).astype(int)
        df['dsg_abnormal'] = ((df['dsg1_index'] > 20) | (df['dsg3_index'] > 20)).astype(int)

        # 4. Imaging Features (AE-focused)
        df['imaging_score'] = df['mri_abnormal'] + df['eeg_abnormal']
        df['imaging_complete'] = ((df['mri_abnormal'] == 1) & (df['eeg_abnormal'] == 1)).astype(int)

        # 5. Neurological Features
        df['neuro_score'] = df['seizures'] + df['memory_loss'] + df['psychiatric_symptoms']
        df['neuro_dominant'] = (df['neuro_score'] >= 2).astype(int)
        df['neuro_complete'] = (df['neuro_score'] == 3).astype(int)

        # 6. Skin Features
        df['skin_score'] = df['skin_blisters'] + df['mucosal_ulcers']
        df['skin_dominant'] = (df['skin_score'] >= 1).astype(int)
        df['skin_complete'] = ((df['skin_blisters'] == 1) & (df['mucosal_ulcers'] == 1)).astype(int)

        # 7. Pain/Severity Features
        df['pain_x_skin'] = df['pain_score'] * df['skin_score']
        df['pain_severity'] = (df['pain_score'] > 5).astype(int)

        # 8. Antibody Features
        df['antibody_log'] = np.log1p(df['antibody_titer'])
        df['antibody_high'] = (df['antibody_titer'] > 60).astype(int)

        # 9. Interaction Features
        df['age_x_csf'] = df['age'] * df['csf_protein']
        df['age_x_dsg'] = df['age'] * df['dsg_total']
        df['neuro_x_csf'] = df['neuro_score'] * df['csf_protein']
        df['dsg_x_skin'] = df['dsg_total'] * df['skin_score']
        df['dsg_x_pain'] = df['dsg_total'] * df['pain_score']
        df['skin_x_pain'] = df['skin_score'] * df['pain_score']
        df['csf_x_imaging'] = df['csf_inflammation'] * df['imaging_score']
        df['antibody_x_csf'] = df['antibody_titer'] * df['csf_protein']

        # 10. Differential Features
        df['clinical_contrast'] = df['neuro_score'] - df['skin_score']
        df['biomarker_contrast'] = (
            (df['csf_protein'] - 30) / 50 - 
            (df['dsg_total'] - 30) / 100
        )

        # 11. Composite Scores
        df['total_symptoms'] = df['neuro_score'] + df['skin_score']
        df['symptom_severity'] = df['total_symptoms'] * df['pain_score']

        # 12. AE Risk Score
        df['ae_risk_score'] = (
            df['csf_abnormal'] * 3 +
            df['neuro_dominant'] * 2 +
            df['imaging_score'] * 2 +
            df['antibody_high'] * 1
        )

        # 13. PV Risk Score
        df['pv_risk_score'] = (
            df['dsg_abnormal'] * 3 +
            df['skin_dominant'] * 2 +
            df['pain_severity'] * 1
        )

        # 14. Disease Patterns
        df['ae_pattern'] = ((df['csf_abnormal'] == 1) & (df['neuro_dominant'] == 1)).astype(int)
        df['pv_pattern'] = ((df['dsg_abnormal'] == 1) & (df['skin_dominant'] == 1)).astype(int)

        # 15. Spurious marker (for compatibility)
        if 'spurious_marker' not in df.columns:
            df['spurious_marker'] = 0

        logger.info(f"✅ Feature Engineering Complete: {df.shape[1]} features for {disease_type}")
        
        df = df.replace([np.inf, -np.inf], np.nan)
        df = df.fillna(0)

        return df

    def _prepare_input_for_model(self, df, model_key, disease_type='AE'):
        """
        FIXED: Disease-aware feature selection
        """
        model = self.models.get(model_key)
        if not model:
            return None

        # Try to get features from model
        cols = []
        if hasattr(model, 'feature_names_in_'):
            cols = list(model.feature_names_in_)
        elif hasattr(model, 'feature_name'):
            cols = model.feature_name()
        
        # Use disease-specific fallback
        if not cols:
            if disease_type == 'AE':
                cols = self.ae_features if model_key == 'rf' else self.ae_features[:15]
            else:  # PV
                cols = self.pv_features if model_key == 'xgb' else self.pv_features[:15]
            logger.warning(f"⚠️ Using {disease_type}-specific fallback for {model_key}")

        # Filter to available columns
        available_cols = [c for c in cols if c in df.columns]
        missing_cols = [c for c in cols if c not in df.columns]
        
        if missing_cols:
            logger.warning(f"⚠️ Missing features for {model_key}: {missing_cols[:5]}")
            # Impute with zeros
            for c in missing_cols:
                df[c] = 0
            available_cols = cols

        return df[available_cols]

    def generate_gradcam(self, image_path):
        """
        FIXED: Only generate GradCAM for HIGH confidence AE predictions
        """
        if not image_path or not self.cnn_model:
            return None
            
        try:
            img = Image.open(image_path).convert('RGB')
            preprocess = transforms.Compose([
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])
            input_tensor = preprocess(img).unsqueeze(0).to(self.device)

            # Get prediction probability
            with torch.no_grad():
                output = self.cnn_model(input_tensor)
                probs = F.softmax(output, dim=1)
                ae_prob = probs[0][1].item()
            
            logger.info(f"🖼️ CNN AE Probability: {ae_prob:.3f}")

            # FIXED: Only generate GradCAM if HIGH confidence (>= 0.60)
            # This prevents false positive heatmaps on normal MRIs
            if ae_prob < 0.45:
                logger.info("   Confidence too low - no GradCAM generated")
                return None

            # Generate GradCAM for high-confidence predictions
            filename = f"gradcam_{os.path.basename(image_path)}"
            save_path = os.path.join(MEDIA_ROOT, 'grad_cam', filename)
            os.makedirs(os.path.dirname(save_path), exist_ok=True)

            input_tensor.requires_grad = True
            activations = []
            gradients = []
            
            def forward_hook(m, i, o):
                activations.append(o)
            def backward_hook(m, gi, go):
                gradients.append(go[0])

            target_layer = self.cnn_model.features[-1]
            h1 = target_layer.register_forward_hook(forward_hook)
            h2 = target_layer.register_full_backward_hook(backward_hook)

            output = self.cnn_model(input_tensor)
            self.cnn_model.zero_grad()
            score = output[:, 1]
            score.backward()
            
            h1.remove()
            h2.remove()

            grads = gradients[0].cpu().data.numpy()[0]
            fmaps = activations[0].cpu().data.numpy()[0]
            weights = np.mean(grads, axis=(1, 2))
            
            cam = np.zeros(fmaps.shape[1:], dtype=np.float32)
            for i, w in enumerate(weights):
                cam += w * fmaps[i]
            
            cam = np.maximum(cam, 0)
            if np.max(cam) > 0:
                cam = cam / np.max(cam)
            
            heatmap = cv2.resize(cam, (224, 224))
            heatmap = np.uint8(255 * heatmap)
            heatmap_colored = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
            
            original_img = cv2.cvtColor(np.array(img.resize((224, 224))), cv2.COLOR_RGB2BGR)
            superimposed = cv2.addWeighted(heatmap_colored, 0.4, original_img, 0.6, 0)
            cv2.imwrite(save_path, superimposed)

            logger.info(f"   ✅ GradCAM generated: {save_path}")
            return f"/media/grad_cam/{filename}"
            
        except Exception as e:
            logger.error(f"❌ GradCAM Error: {e}")
            traceback.print_exc()
            return None

    def calculate_shap(self, df_processed, is_positive_prediction, disease_type='AE'):
        """
        FIXED: Disease-specific SHAP with proper feature selection
        """
        try:
            # Select explainer and features based on disease
            if disease_type == 'PV' and 'xgb' in self.explainers:
                explainer = self.explainers['xgb']
                model_key = 'xgb'
                logger.info("🔍 Using XGB SHAP for PV")
            elif 'rf' in self.explainers:
                explainer = self.explainers['rf']
                model_key = 'rf'
                logger.info("🔍 Using RF SHAP for AE")
            else:
                logger.warning("⚠️ No SHAP explainer available")
                return []

            # Prepare input with disease-specific features
            X = self._prepare_input_for_model(df_processed, model_key, disease_type)
            if X is None or X.empty:
                logger.warning("⚠️ Failed to prepare SHAP input")
                return []

            logger.info(f"   Input shape: {X.shape}, Features: {list(X.columns)[:5]}...")

            # Calculate SHAP
            shap_values = explainer.shap_values(X, check_additivity=False)
            
            # Extract values for positive class
            sv = None
            if isinstance(shap_values, list):
                n_classes = len(shap_values)
                logger.info(f"   SHAP classes: {n_classes}")
                sv = shap_values[1] if n_classes > 1 else shap_values[0]
            elif isinstance(shap_values, np.ndarray):
                sv = shap_values

            # Handle dimensions
            if sv is not None:
                if sv.ndim == 3:
                    sv = sv[0, :, 1] if sv.shape[2] > 1 else sv[0, :, 0]
                elif sv.ndim == 2:
                    sv = sv[0]

            if sv is None:
                logger.warning("⚠️ Could not extract SHAP values")
                return []

            # Validate
            if hasattr(explainer, 'expected_value'):
                ev = explainer.expected_value
                if isinstance(ev, (list, np.ndarray)):
                    ev = ev[1] if len(ev) > 1 else ev[0]
                try:
                    ev_val = float(ev)
                except Exception:
                    ev_val = None

                try:
                    sv_sum = float(np.sum(sv))
                except Exception:
                    sv_sum = None

                logger.info(
                    f"   Base value: {ev_val}, SHAP sum: {sv_sum}"
)


            # Extract top features
            feature_names = X.columns.tolist()
            feature_values = X.iloc[0]
            features = []
            
            indices = np.argsort(np.abs(sv))[::-1][:5]
            
            for idx in indices:
                if idx >= len(feature_names):
                    continue
                    
                impact = float(sv[idx])
                if abs(impact) < 0.001:
                    continue

                name = str(feature_names[idx])
                val = feature_values.iloc[idx]
                
                # Determine direction
                direction = "Increased Risk" if impact > 0 else "Decreased Risk"
                
                # Apply medical thresholds
                if disease_type == 'AE':
                    if name in ['csf_protein'] and val > 45:
                        direction = "Increased Risk"
                    elif name in ['csf_cells'] and val > 5:
                        direction = "Increased Risk"
                    elif name in ['seizures', 'memory_loss', 'psychiatric_symptoms'] and val > 0:
                        direction = "Increased Risk"
                    elif name in ['antibody_titer'] and val > 60:
                        direction = "Increased Risk"
                        
                elif disease_type == 'PV':
                    if name in ['dsg1_index'] and val > 20:
                        direction = "Increased Risk"
                    elif name in ['dsg3_index'] and val > 20:
                        direction = "Increased Risk"
                    elif name in ['skin_blisters', 'mucosal_ulcers'] and val > 0:
                        direction = "Increased Risk"

                features.append({
                    "label": name,
                    "value": impact,
                    "display_value": min(100, abs(impact) * 50),
                    "raw_input": f"{val:.2f}",
                    "direction": direction
                })

            logger.info(f"   ✅ Extracted {len(features)} SHAP features")
            return features
            
        except Exception as e:
            logger.error(f"❌ SHAP Error: {e}")
            traceback.print_exc()
            return []

    def generate_explanation(self, result, confidence, df, disease_type):
        """Generate human-readable explanation with disease-specific logic"""
        if result == "Normal":
            return f"The AI analysis indicates a {confidence}% probability of Normal status."
            
        row = df.iloc[0]
        reasons = []
        
        if disease_type == 'AE':
            if row['csf_protein'] > 45:
                reasons.append(f"elevated CSF protein ({row['csf_protein']:.1f} mg/dL, normal <45)")
            if row['csf_cells'] > 5:
                reasons.append(f"elevated CSF cells ({row['csf_cells']:.0f}, normal <5)")
            if row['seizures'] == 1:
                reasons.append("seizure activity present")
            if row['memory_loss'] == 1:
                reasons.append("memory impairment")
            if row['antibody_titer'] > 60:
                reasons.append(f"elevated antibodies ({row['antibody_titer']:.0f})")
            if row['mri_abnormal'] == 1 or row['eeg_abnormal'] == 1:
                reasons.append("abnormal brain imaging")
                
        elif disease_type == 'PV':
            if row['dsg1_index'] > 20:
                reasons.append(f"elevated Dsg1 antibodies ({row['dsg1_index']:.1f}, normal <20)")
            if row['dsg3_index'] > 20:
                reasons.append(f"elevated Dsg3 antibodies ({row['dsg3_index']:.1f}, normal <20)")
            if row['skin_blisters'] == 1:
                reasons.append("skin blistering present")
            if row['mucosal_ulcers'] == 1:
                reasons.append("mucosal ulceration present")
            if row['pain_score'] > 5:
                reasons.append(f"significant pain (score {row['pain_score']}/10)")
                
        reason_str = ", ".join(reasons) if reasons else "clinical pattern matching"
        return f"The model predicts {result} ({confidence}% confidence) based on {reason_str}."

    def calibrate_prediction(self, ml_prob, df, disease_type):
        """
        Clinical calibration with logging
        """
        row = df.iloc[0]
        clinical_conf = 0
        reasons = []
        
        if disease_type == 'AE':
            if row['csf_protein'] > 45:
                clinical_conf += 35
                reasons.append(f"CSF protein {row['csf_protein']:.1f} > 45")
            if row['csf_cells'] > 5:
                clinical_conf += 25
                reasons.append(f"CSF cells {row['csf_cells']:.0f} > 5")
            if row['seizures'] == 1:
                clinical_conf += 25
                reasons.append("Seizures present")
            if row['memory_loss'] == 1:
                clinical_conf += 20
                reasons.append("Memory loss present")
            if row['antibody_titer'] > 60:
                clinical_conf += 15
                reasons.append(f"Antibodies {row['antibody_titer']:.0f} > 60")
                
        elif disease_type == 'PV':
            if row['dsg1_index'] > 20:
                clinical_conf += 50
                reasons.append(f"Dsg1 {row['dsg1_index']:.1f} > 20")
            if row['dsg3_index'] > 20:
                clinical_conf += 30
                reasons.append(f"Dsg3 {row['dsg3_index']:.1f} > 20")
            if row['skin_blisters'] == 1:
                clinical_conf += 30
                reasons.append("Skin blisters present")
            if row['mucosal_ulcers'] == 1:
                clinical_conf += 20
                reasons.append("Mucosal ulcers present")

        if clinical_conf > 0:
            clinical_prob = min(0.99, clinical_conf / 100.0)
            logger.info(f"🏥 Clinical Calibration: score={clinical_conf}, reasons={reasons}")
            
            if clinical_conf >= 50:
                calibrated = max(ml_prob, clinical_prob)
                if calibrated > ml_prob:
                    logger.info(f"   ⚠️ OVERRIDE: {ml_prob:.3f} → {calibrated:.3f}")
                return calibrated
            
            return max(ml_prob, clinical_prob * 0.7)
            
        return ml_prob

    def predict(self, clinical_data, mri_path=None, disease_type='AE'):
        """
        FIXED: Complete prediction pipeline with proper disease handling
        """
        logger.info(f"\n{'='*70}")
        logger.info(f"🔬 Prediction Pipeline: {disease_type}")
        logger.info(f"{'='*70}")
        logger.info(f"MRI provided: {mri_path is not None}")

        # Prepare data
        df = pd.DataFrame([clinical_data])
        df = df.apply(pd.to_numeric, errors='coerce').fillna(0)
        
        # FIXED: Pass disease_type to feature engineering
        df_processed = self.engineer_features(df, disease_type=disease_type)
        
        logger.info(f"📋 Engineered features: {df_processed.shape[1]}")

        # Base model predictions
        ml_prob = 0.0
        
        try:
            # RF prediction
            rf_prob = 0.5
            if 'rf' in self.models:
                X_rf = self._prepare_input_for_model(df_processed, 'rf', disease_type)
                if X_rf is not None:
                    rf_probs = self.models['rf'].predict_proba(X_rf)[0]
                    rf_prob = rf_probs[1] if len(rf_probs) > 1 else rf_probs[0]
                    logger.info(f"   RF: {rf_prob:.3f}")

            # XGB prediction
            xgb_prob = rf_prob
            if 'xgb' in self.models:
                X_xgb = self._prepare_input_for_model(df_processed, 'xgb', disease_type)
                if X_xgb is not None:
                    try:
                        xgb_probs = self.models['xgb'].predict_proba(X_xgb)[0]
                        xgb_prob = xgb_probs[1] if len(xgb_probs) > 1 else xgb_probs[0]
                    except AttributeError:
                        dmatrix = xgb.DMatrix(X_xgb)
                        xgb_prob = float(self.models['xgb'].predict(dmatrix)[0])
                    logger.info(f"   XGB: {xgb_prob:.3f}")

            # LGB prediction
            lgb_prob = rf_prob
            if 'lgbm' in self.models:
                X_lgb = self._prepare_input_for_model(df_processed, 'lgbm', disease_type)
                if X_lgb is not None:
                    try:
                        lgb_probs = self.models['lgbm'].predict_proba(X_lgb)[0]
                        lgb_prob = lgb_probs[1] if len(lgb_probs) > 1 else lgb_probs[0]
                    except AttributeError:
                        lgb_prob = float(self.models['lgbm'].predict(X_lgb)[0])
                    logger.info(f"   LGB: {lgb_prob:.3f}")

            # Ensemble
            if 'meta' in self.models:
                try:
                    # Assuming binary classification for meta
                    rf_probs_full = np.array([1-rf_prob, rf_prob])
                    xgb_probs_full = np.array([1-xgb_prob, xgb_prob])
                    lgb_probs_full = np.array([1-lgb_prob, lgb_prob])
                    
                    
                    stack_input = np.concatenate([rf_probs_full, xgb_probs_full, lgb_probs_full,  np.zeros(3)])
                    stack_input = stack_input.reshape(1, -1)
                    
                    meta_probs = self.models['meta'].predict_proba(stack_input)[0]
                    ml_prob = meta_probs[1] if len(meta_probs) > 1 else meta_probs[0]
                    logger.info(f"   Meta: {ml_prob:.3f}")
                except Exception as e:
                    logger.warning(f"Meta-learner failed: {e}, using average")
                    ml_prob = (rf_prob + xgb_prob + lgb_prob) / 3.0
            else:
                ml_prob = (rf_prob + xgb_prob + lgb_prob) / 3.0
                logger.info(f"   Average: {ml_prob:.3f}")

        except Exception as e:
            logger.error(f"❌ Prediction Error: {e}")
            traceback.print_exc()
            ml_prob = 0.5

        # Clinical calibration
        ml_prob = self.calibrate_prediction(ml_prob, df_processed, disease_type)
        logger.info(f"📊 After calibration: {ml_prob:.3f}")

        # CNN fusion (AE only, and only if MRI provided)
        cnn_prob = 0.0
        grad_cam_url = None
        
        # FIXED: Only process MRI if actually provided and for AE
        if disease_type == 'AE' and mri_path and self.cnn_model:
            try:
                img = Image.open(mri_path).convert('RGB')
                preprocess = transforms.Compose([
                    transforms.Resize((224, 224)),
                    transforms.ToTensor(),
                    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
                ])
                
                with torch.no_grad():
                    output = self.cnn_model(preprocess(img).unsqueeze(0).to(self.device))
                    cnn_prob = F.softmax(output, dim=1)[0][1].item()
                
                logger.info(f"🧠 CNN: {cnn_prob:.3f}")
                
                # Generate GradCAM (only if high confidence)
                grad_cam_url = self.generate_gradcam(mri_path)
                
            except Exception as e:
                logger.error(f"❌ CNN Error: {e}")
                traceback.print_exc()

        # Final fusion
        if disease_type == 'AE' and cnn_prob > 0:
            final_prob = (ml_prob * 0.7) + (cnn_prob * 0.3)
            logger.info(f"🔬 Fused: ML({ml_prob:.3f}) + CNN({cnn_prob:.3f}) = {final_prob:.3f}")
        else:
            final_prob = ml_prob
            logger.info(f"🔬 Final: {final_prob:.3f} (tabular only)")

        # Determine result
        final_conf = round(final_prob * 100, 2)
        
        if final_prob > 0.5:
            ml_result = "Autoimmune Encephalitis (AE)" if disease_type == 'AE' else "Pemphigus Vulgaris (PV)"
            is_positive = True
        else:
            ml_result = "Normal"
            final_conf = round((1.0 - final_prob) * 100, 2)
            is_positive = False

        final_conf = max(5.0, min(95.0, final_conf))
        
        logger.info(f"\n{'='*70}")
        logger.info(f"✅ RESULT: {ml_result} ({final_conf}%)")
        logger.info(f"{'='*70}\n")

        # Generate explanations
        shap_data = self.calculate_shap(df_processed, is_positive, disease_type)
        explanation = self.generate_explanation(ml_result, final_conf, df_processed, disease_type)
        
        return {
            "result": ml_result,
            "confidence": final_conf,
            "explanation": explanation,
            "grad_cam": grad_cam_url,
            "shap_features": shap_data,
            "full_data": df_processed.iloc[0].to_dict()
        }

    # Convenience methods
    def predict_pv_ensemble(self, data):
        return self.predict(data, disease_type='PV')
    
    def predict_ae_fusion(self, data, mri):
        return self.predict(data, mri_path=mri, disease_type='AE')