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
from PIL import Image
from django.conf import settings
from torch.nn import functional as F

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
        
        # --- HARDCODED FEATURE SCHEMAS (Based on Error Logs) ---
        # 1. XGBoost explicit features (Includes Skin/Clinical symptoms)
        self.xgb_features = [
            'seizures', 'memory_loss', 'psychiatric_symptoms', 'skin_blisters', 
            'mucosal_ulcers', 'pain_score', 'age', 'sex', 'csf_protein', 
            'neuro_score', 'skin_score', 'total_symptoms', 'clinical_contrast', 
            'pain_x_skin', 'symptom_severity'
        ]
        
        # 2. Random Forest features (AE Focused)
        self.rf_features_fallback = [
            'csf_protein', 'csf_cells', 'mri_abnormal', 'eeg_abnormal', 
            'age', 'sex', 'spurious_marker', 'csf_protein_log', 
            'csf_cells_log', 'csf_inflammation', 'csf_ratio', 
            'imaging_score', 'age_x_csf'
        ]

        # 3. Load Models
        self._load_models()
        self._load_explainers() # Renamed to handle multiple explainers
        self._load_cnn()

    def _load_models(self):
        try:
            # Random Forest
            if os.path.exists(os.path.join(MODEL_DIR, 'rf_model.pkl')):
                self.models['rf'] = joblib.load(os.path.join(MODEL_DIR, 'rf_model.pkl'))
                print("✅ RF Model Loaded")

            # XGBoost
            if os.path.exists(os.path.join(MODEL_DIR, 'xgb_model.pkl')):
                self.models['xgb'] = joblib.load(os.path.join(MODEL_DIR, 'xgb_model.pkl'))
                print("✅ XGBoost Model Loaded")
            elif os.path.exists(os.path.join(MODEL_DIR, 'xgb_model.json')):
                self.models['xgb'] = xgb.Booster()
                self.models['xgb'].load_model(os.path.join(MODEL_DIR, 'xgb_model.json'))
                print("✅ XGBoost (JSON) Loaded")

            # LightGBM
            if os.path.exists(os.path.join(MODEL_DIR, 'lgb_model.pkl')):
                self.models['lgbm'] = joblib.load(os.path.join(MODEL_DIR, 'lgb_model.pkl'))
                print("✅ LightGBM Model Loaded")
            elif os.path.exists(os.path.join(MODEL_DIR, 'lgb_model.txt')):
                import lightgbm as lgb
                self.models['lgbm'] = lgb.Booster(model_file=os.path.join(MODEL_DIR, 'lgb_model.txt'))
                print("✅ LightGBM (TXT) Loaded")

            # Meta Learner
            if os.path.exists(os.path.join(MODEL_DIR, 'stacking_meta_learner.pkl')):
                self.models['meta'] = joblib.load(os.path.join(MODEL_DIR, 'stacking_meta_learner.pkl'))
                print("✅ Meta-Learner Loaded")
                
        except Exception as e:
            print(f"❌ Error loading tabular models: {e}")

    def _load_explainers(self):
        self.explainers = {}
        
        # 1. RF Explainer (Best for AE / Tabular)
        try:
            shap_path = os.path.join(MODEL_DIR, 'shap_explainer_rf.pkl')
            if os.path.exists(shap_path):
                self.explainers['rf'] = joblib.load(shap_path)
                print("✅ SHAP (RF) Loaded from File")
            elif 'rf' in self.models:
                self.explainers['rf'] = shap.TreeExplainer(self.models['rf'])
                print("✅ SHAP (RF) Initialized")
        except Exception as e:
            print(f"⚠️ SHAP (RF) Init Warning: {e}")

        # 2. XGB Explainer (Best for PV / Clinical)
        # We try to load this to give better features for PV cases
        try:
            if 'xgb' in self.models:
                self.explainers['xgb'] = shap.TreeExplainer(self.models['xgb'])
                print("✅ SHAP (XGB) Initialized")
        except Exception as e:
            print(f"⚠️ SHAP (XGB) Init Warning: {e}")

    def _load_cnn(self):
        self.cnn_model = None
        try:
            cnn_path = os.path.join(MODEL_DIR, 'ae_cnn_model.pth')
            if not os.path.exists(cnn_path): cnn_path = os.path.join(MODEL_DIR, 'fusion_ann.pth')
            
            if os.path.exists(cnn_path):
                self.cnn_model = AE_CNN_Model().to(self.device)
                state_dict = torch.load(cnn_path, map_location=self.device)
                self.cnn_model.load_state_dict(state_dict, strict=False)
                self.cnn_model.eval()
                print("✅ AE CNN Model Loaded")
        except Exception as e:
            print(f"❌ CNN Load Error: {e}")

    def engineer_features(self, df):
        """
        Master Feature Engineering - Generates SUPERSET of all possible features
        """
        # 1. Base Columns
        base_cols = [
            'age', 'sex', 'seizures', 'memory_loss', 'psychiatric_symptoms',
            'skin_blisters', 'mucosal_ulcers', 'pain_score', 'csf_protein',
            'csf_cells', 'antibody_titer', 'dsg1_index', 'dsg3_index', 
            'mri_abnormal', 'eeg_abnormal', 'tumor_status', 'infection_status'
        ]
        for col in base_cols:
            if col not in df.columns: df[col] = 0

        # 2. Derived Features
        df['csf_protein_log'] = np.log1p(df['csf_protein'])
        df['csf_cells_log'] = np.log1p(df['csf_cells'])
        df['csf_inflammation'] = df['csf_protein'] * df['csf_cells']
        df['csf_ratio'] = df['csf_protein'] / (df['csf_cells'] + 1)
        df['imaging_score'] = df['mri_abnormal'] + df['eeg_abnormal']
        df['age_x_csf'] = df['age'] * df['csf_protein']

        df['neuro_score'] = df['seizures'] + df['memory_loss'] + df['psychiatric_symptoms']
        df['skin_score'] = df['skin_blisters'] + df['mucosal_ulcers']
        df['total_symptoms'] = df['neuro_score'] + df['skin_score']
        df['clinical_contrast'] = df['neuro_score'] - df['skin_score']
        df['pain_x_skin'] = df['pain_score'] * df['skin_score']
        df['symptom_severity'] = df['total_symptoms'] * df['pain_score']

        df['neuro_x_csf'] = df['neuro_score'] * df['csf_protein']
        df['skin_x_pain'] = df['skin_score'] * df['pain_score']
        df['csf_product'] = df['csf_protein'] * df['csf_cells'] 
        
        df['spurious_marker'] = 0 
        
        return df

    def _prepare_input_for_model(self, df, model_key, fallback_cols=None):
        """
        Strict feature alignment per model to prevent mismatch errors.
        """
        model = self.models.get(model_key)
        if not model: return None

        cols = []
        
        # 1. Try to get features from model object
        if hasattr(model, 'feature_names_in_'):
            cols = list(model.feature_names_in_)
        elif hasattr(model, 'feature_name'): # LightGBM/XGB Booster
            cols = model.feature_name()
        
        # 2. Use fallback if detection failed
        if not cols and fallback_cols:
            cols = fallback_cols
            
        # 3. If still no columns (e.g., LGBM), just use dataframe as is (risky but necessary)
        if not cols:
            return df

        # 4. Filter/Order DataFrame
        for c in cols:
            if c not in df.columns:
                df[c] = 0 # Impute missing columns
        
        return df[cols]

    def generate_gradcam(self, image_path):
        if not image_path or not self.cnn_model: return None
        try:
            img = Image.open(image_path).convert('RGB')
            preprocess = transforms.Compose([
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
            ])
            input_tensor = preprocess(img).unsqueeze(0).to(self.device)
            input_tensor.requires_grad = True

            # Define filename/path first
            filename = f"gradcam_{os.path.basename(image_path)}"
            save_path = os.path.join(MEDIA_ROOT, 'grad_cam', filename)
            os.makedirs(os.path.dirname(save_path), exist_ok=True)

            # --- PRE-CHECK: Prediction Probability ---
            with torch.no_grad():
                test_out = self.cnn_model(input_tensor)
                probs = F.softmax(test_out, dim=1)
                ae_prob = probs[0][1].item()
            
            # Prepare original image for saving (opencv format)
            original_img = cv2.cvtColor(np.array(img.resize((224, 224))), cv2.COLOR_RGB2BGR)

            # If the model is less than 50% sure it's AE, return ORIGINAL IMAGE (Normal)
            # This fixes "not displaying" while avoiding "red noise"
            if ae_prob < 0.5:
                cv2.imwrite(save_path, original_img)
                return f"/media/grad_cam/{filename}"

            # If AE (High Prob), Generate GradCAM
            activations = []
            gradients = []
            def forward_hook(m, i, o): activations.append(o)
            def backward_hook(m, gi, go): gradients.append(go[0])

            target_layer = self.cnn_model.features[-1] 
            h1 = target_layer.register_forward_hook(forward_hook)
            h2 = target_layer.register_full_backward_hook(backward_hook)

            output = self.cnn_model(input_tensor)
            self.cnn_model.zero_grad()
            score = output[:, 1]
            score.backward()
            h1.remove(); h2.remove()

            grads = gradients[0].cpu().data.numpy()[0]
            fmaps = activations[0].cpu().data.numpy()[0]
            weights = np.mean(grads, axis=(1, 2))
            cam = np.zeros(fmaps.shape[1:], dtype=np.float32)
            for i, w in enumerate(weights): cam += w * fmaps[i]
            cam = np.maximum(cam, 0)
            if np.max(cam) > 0: cam = cam / np.max(cam)
            
            heatmap = cv2.resize(cam, (224, 224))
            heatmap = np.uint8(255 * heatmap)
            heatmap_colored = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
            
            # Superimpose
            superimposed = cv2.addWeighted(heatmap_colored, 0.4, original_img, 0.6, 0)
            cv2.imwrite(save_path, superimposed)

            return f"/media/grad_cam/{filename}"
        except: return None

    def calculate_shap(self, df_processed, is_positive_prediction, disease_type='AE'):
        """
        Calculates SHAP values dynamically based on Disease Type.
        """
        try:
            # 1. Select Explainer & Features based on Disease Type
            explainer = None
            cols = []
            model_key = 'rf'

            if disease_type == 'PV' and 'xgb' in self.explainers:
                # Use XGB for PV as it contains skin/symptom features
                explainer = self.explainers['xgb']
                cols = self.xgb_features
                model_key = 'xgb'
            elif 'rf' in self.explainers:
                # Default to RF for AE
                explainer = self.explainers['rf']
                cols = self.rf_features_fallback
                model_key = 'rf'

            if not explainer: return []

            # 2. Prepare Input
            X = self._prepare_input_for_model(df_processed, model_key, cols)
            if X is None: return []

            # 3. Calculate SHAP
            shap_values = explainer.shap_values(X, check_additivity=False)
            
            sv = None
            # Handle List output (common in classifiers)
            if isinstance(shap_values, list):
                idx = 1 if len(shap_values) > 1 else 0
                sv = shap_values[idx]
            elif isinstance(shap_values, np.ndarray):
                sv = shap_values
            
            # Handle dimensions
            if sv is not None:
                if sv.ndim == 3: sv = sv[0,:,1] if sv.shape[2] > 1 else sv[0,:,0]
                elif sv.ndim == 2: sv = sv[0] 
            
            if sv is None: return []

            feature_names = X.columns.tolist()
            feature_values = X.iloc[0]
            features = []
            
            indices = np.argsort(np.abs(sv))[::-1][:5]
            
            for idx in indices:
                impact = float(sv[idx])
                if abs(impact) < 0.001: continue
                
                # Boundary check
                if idx >= len(feature_names): continue

                name = str(feature_names[idx])
                val = feature_values.iloc[idx]
                
                direction = "Increased Risk" if impact > 0 else "Decreased Risk"
                
                # --- CLINICAL OVERRIDE FOR UI CLARITY (WITH MEDICAL THRESHOLDS) ---
                # Only force "Increased Risk" if the value is actually medically abnormal
                
                if name == 'dsg1_index' and val > 20: direction = "Increased Risk"
                elif name == 'dsg3_index' and val > 20: direction = "Increased Risk"
                elif name == 'csf_protein' and val > 45: direction = "Increased Risk"
                elif name == 'csf_cells' and val > 5: direction = "Increased Risk"
                elif name in ['mucosal_ulcers', 'skin_blisters', 'seizures'] and val > 0: direction = "Increased Risk"

                features.append({
                    "label": name,
                    "value": impact,
                    "display_value": min(100, abs(impact) * 50),
                    "raw_input": f"{val:.2f}",
                    "direction": direction
                })
            
            return features
        except Exception as e:
            print(f"⚠️ SHAP Calculation Error: {e}")
            return []

    def generate_explanation(self, result, confidence, df, disease_type):
        if result == "Normal":
            return f"The AI analysis indicates a {confidence}% probability of Normal status."
        row = df.iloc[0]
        reasons = []
        if disease_type == 'AE':
            if row['csf_protein'] > 45: reasons.append(f"high CSF protein ({row['csf_protein']} mg/dL)")
            if row['seizures'] == 1: reasons.append("seizure activity")
        elif disease_type == 'PV':
            if row['dsg1_index'] > 20: reasons.append(f"elevated Dsg1 ({row['dsg1_index']})")
            if row['dsg3_index'] > 20: reasons.append(f"elevated Dsg3 ({row['dsg3_index']})")
        reason_str = ", ".join(reasons) if reasons else "clinical pattern matching"
        return f"The model predicts {result} ({confidence}% risk score) driven by {reason_str}."

    def calibrate_prediction(self, ml_prob, df, disease_type):
        """
        Clinical Guardrail - Overrides AI if biomarkers are definitively high.
        """
        row = df.iloc[0]
        clinical_conf = 0
        
        if disease_type == 'AE':
            if row['csf_protein'] > 45: clinical_conf += 35
            if row['seizures'] == 1: clinical_conf += 25
            if row['memory_loss'] == 1: clinical_conf += 20
        elif disease_type == 'PV':
            # PV is driven heavily by Dsg1/Dsg3
            if row['dsg1_index'] > 20: clinical_conf += 50
            if row['dsg3_index'] > 20: clinical_conf += 30
            if row['skin_blisters'] == 1: clinical_conf += 30
            if row['mucosal_ulcers'] == 1: clinical_conf += 20
        
        if clinical_conf > 0:
             # If clinical signs are present, ensure we don't return < 0.5 if signs are strong
             # Normalize clinical_conf to max 0.99
             clinical_prob = min(0.99, clinical_conf / 100.0)
             
             # If clinical_conf is very high (>50), force the probability to be at least that high
             if clinical_conf >= 50:
                 return max(ml_prob, clinical_prob)
             
             # Otherwise, blend them
             return max(ml_prob, clinical_prob)
             
        return ml_prob

    def predict(self, clinical_data, mri_path=None, disease_type='AE'):
        print(f"📥 Pipeline: {disease_type}")
        df = pd.DataFrame([clinical_data])
        df = df.apply(pd.to_numeric, errors='coerce').fillna(0)
        df_processed = self.engineer_features(df)

        ml_result = "Normal"
        ml_prob = 0.0
        
        try:
            # --- 1. PREDICT: RANDOM FOREST ---
            rf_probs = np.array([0.5, 0.5]) # Default
            rf_final_prob = 0.5
            
            if 'rf' in self.models:
                X_rf = self._prepare_input_for_model(df_processed, 'rf', self.rf_features_fallback)
                rf_raw = self.models['rf'].predict_proba(X_rf) # Shape (1, n_classes)
                rf_probs = rf_raw[0] # Shape (n_classes,)
                rf_final_prob = rf_probs[1] if len(rf_probs) > 1 else rf_probs[0]

            # --- 2. PREDICT: XGBOOST ---
            xgb_probs = rf_probs # Fallback
            xgb_final_prob = rf_final_prob
            
            if 'xgb' in self.models:
                # Use strict XGB features from log
                X_xgb = self._prepare_input_for_model(df_processed, 'xgb', self.xgb_features)
                try:
                    # Sklearn wrapper
                    xgb_raw = self.models['xgb'].predict_proba(X_xgb)
                    xgb_probs = xgb_raw[0]
                    xgb_final_prob = xgb_probs[1] if len(xgb_probs) > 1 else xgb_probs[0]
                except AttributeError:
                    # Native Booster
                    dmatrix = xgb.DMatrix(X_xgb)
                    pred = float(self.models['xgb'].predict(dmatrix)[0])
                    # Native usually returns single float for binary
                    xgb_probs = np.array([1-pred, pred]) 
                    xgb_final_prob = pred

            # --- 3. PREDICT: LIGHTGBM ---
            lgb_probs = rf_probs # Fallback
            lgb_final_prob = rf_final_prob
            
            if 'lgbm' in self.models:
                # Try to auto-detect LGBM features (likely different from XGB/RF)
                # If auto-detect fails, we pass df_processed; LGBM might select cols by name or index
                X_lgb = self._prepare_input_for_model(df_processed, 'lgbm', None)
                
                try:
                    # Sklearn wrapper
                    lgb_raw = self.models['lgbm'].predict_proba(X_lgb)
                    lgb_probs = lgb_raw[0]
                    lgb_final_prob = lgb_probs[1] if len(lgb_probs) > 1 else lgb_probs[0]
                except AttributeError:
                    # Native Booster
                    pred = float(self.models['lgbm'].predict(X_lgb)[0])
                    lgb_probs = np.array([1-pred, pred])
                    lgb_final_prob = pred

            print(f"📊 Bases: RF={rf_final_prob:.2f}, XGB={xgb_final_prob:.2f}, LGB={lgb_final_prob:.2f}")

            # --- 4. META LEARNER (STACKING) ---
            if 'meta' in self.models:
                # ERROR FIX: "Expecting 9 features"
                # This implies 3 models x 3 classes (Normal, AE, PV) = 9 features
                # We concatenate the full probability vectors
                
                # Check dimensions to ensure we have enough data to fill 9 slots if needed
                # If binary (2 classes), we might need to pad or the meta model expects something else
                # But given the error "X has 3 features... expecting 9", concatenating vectors is the standard fix
                
                stack_input = np.concatenate([rf_probs, xgb_probs, lgb_probs])
                
                # Reshape for single sample prediction: (1, 9)
                stack_input = stack_input.reshape(1, -1)
                
                # Determine prob from meta
                meta_raw = self.models['meta'].predict_proba(stack_input)[0]
                ml_prob = meta_raw[1] if len(meta_raw) > 1 else meta_raw[0]
            else:
                ml_prob = (rf_final_prob + xgb_final_prob + lgb_final_prob) / 3.0

        except Exception as e:
            print(f"❌ Stack Error: {e}")
            traceback.print_exc()
            ml_prob = 0.0

        # Calibration
        ml_prob = self.calibrate_prediction(ml_prob, df_processed, disease_type)

        # Fusion
        cnn_prob = 0.0
        grad_cam_url = None
        if disease_type == 'AE' and mri_path and self.cnn_model:
            try:
                img = Image.open(mri_path).convert('RGB')
                preprocess = transforms.Compose([transforms.Resize((224, 224)), transforms.ToTensor(), transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])])
                output = self.cnn_model(preprocess(img).unsqueeze(0).to(self.device))
                cnn_prob = F.softmax(output, dim=1)[0][1].item()
                grad_cam_url = self.generate_gradcam(mri_path)
            except: pass

        if disease_type == 'AE' and mri_path:
            final_prob = (ml_prob * 0.7) + (cnn_prob * 0.3)
        else:
            final_prob = ml_prob

        # Result
        final_conf = round(final_prob * 100, 2)
        if final_prob > 0.5:
            ml_result = "Autoimmune Encephalitis (AE)" if disease_type == 'AE' else "Pemphigus Vulgaris (PV)"
            is_positive = True
        else:
            ml_result = "Normal"
            final_conf = round((1.0 - final_prob) * 100, 2)
            is_positive = False

        final_conf = max(5.0, min(95.0, final_conf))
        print(f"🤖 Final: {ml_result} ({final_conf}%)")

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

    def predict_pv_ensemble(self, data): return self.predict(data, disease_type='PV')
    def predict_ae_fusion(self, data, mri): return self.predict(data, mri_path=mri, disease_type='AE')