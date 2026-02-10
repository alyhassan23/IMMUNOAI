import unittest
from unittest.mock import MagicMock, patch
import pandas as pd
import numpy as np
import torch

# Import the class but don't instantiate it yet
from api.services.ai_engine import HybridAIEngine

class TestHybridAIEngine(unittest.TestCase):
    
    @patch('api.services.ai_engine.shap') # Mock SHAP to prevent TreeExplainer errors
    @patch('api.services.ai_engine.joblib.load')
    @patch('api.services.ai_engine.torch.load')
    @patch('api.services.ai_engine.os.path.exists')
    def setUp(self, mock_exists, mock_torch_load, mock_joblib_load, mock_shap):
        """
        Setup a HybridAIEngine instance with MOCKED models.
        """
        # 1. Mock file existence
        mock_exists.return_value = True
        
        # 2. Mock Tabular Models (RF, XGB, LGB)
        self.mock_model = MagicMock()
        # predict_proba returns [prob_AE, prob_Normal, prob_PV] (example)
        self.mock_model.predict_proba.return_value = np.array([[0.1, 0.8, 0.1]]) 
        self.mock_model.feature_names_in_ = ['seizures', 'csf_protein'] 
        
        mock_joblib_load.return_value = self.mock_model
        
        # 3. Mock CNN Model weights
        mock_torch_load.return_value = {} 

        # 4. Instantiate the Engine with a mocked ResNet
        with patch('api.services.ai_engine.models.resnet50') as MockResNet:
            mock_cnn_instance = MockResNet.return_value
            mock_cnn_instance.to.return_value = mock_cnn_instance
            mock_cnn_instance.eval.return_value = None
            mock_cnn_instance.load_state_dict.return_value = None
            
            # Initialize engine
            self.engine = HybridAIEngine()
            
            # Manually inject the mocked CNN
            self.engine.cnn_model = mock_cnn_instance

    def test_fusion_logic_high_risk(self):
        """Test fusion: (Tabular * 0.6) + (CNN * 0.4)"""
        # 1. Mock Tabular to 90% AE (Index 1 = Positive)
        for model in self.engine.models.values():
            model.predict_proba.return_value = np.array([[0.1, 0.9, 0.0]]) # [Other, AE, Other]

        # 2. Mock CNN to 80% AE (Index 1 = Positive)
        # We need to mock generating gradcam too as it is called
        with patch.object(self.engine, 'generate_gradcam') as mock_gradcam:
            mock_gradcam.return_value = None
            
            # Mock CNN output
            # AE_CNN_Model returns logits. 
            # predict_ae_fusion calls: cnn_prob = F.softmax(output, dim=1)[0][1].item()
            # We want class 1 (AE) to be high. [1.0, 3.0] -> Softmax ~ [0.12, 0.88]
            self.engine.cnn_model.return_value = torch.tensor([[1.0, 3.0]]) 

            result = self.engine.predict_ae_fusion({}, mri="dummy.jpg")
            
            self.assertIn("Autoimmune Encephalitis", result['result'])
            self.assertTrue(result['confidence'] > 50)

    def test_prediction_normal_no_mri(self):
        """Test tabular-only prediction for normal case"""
        # Mock models to return Normal (Index 1 = Low)
        for model in self.engine.models.values():
            model.predict_proba.return_value = np.array([[0.9, 0.1, 0.0]]) # [Normal, AE, PV]

        result = self.engine.predict_ae_fusion({}, mri=None)
        
        self.assertEqual(result['result'], "Normal")

    def test_engineer_features(self):
        """Test if all derived features are generated"""
        input_data = {
            'seizures': 1, 'memory_loss': 1, 'csf_protein': 50, 'csf_cells': 5,
            'age': 30, 'pain_score': 8, 'skin_blisters': 1
        }
        df = pd.DataFrame([input_data])
        processed_df = self.engine.engineer_features(df)
        
        self.assertIn('csf_protein_log', processed_df.columns)
        self.assertIn('neuro_score', processed_df.columns)
        self.assertEqual(processed_df.iloc[0]['neuro_score'], 2) # seizures(1) + memory(1) + psych(0)
        self.assertEqual(processed_df.iloc[0]['csf_inflammation'], 250) # 50 * 5

    def test_calculate_shap_structure(self):
        """Test SHAP calculation returns correct list structure"""
        # Mock explainer
        mock_explainer = MagicMock()
        mock_explainer.shap_values.return_value = np.array([[1.0, -2.0]]) # valid shape
        self.engine.explainers['rf'] = mock_explainer
        
        input_data = {'seizures': 1, 'csf_protein': 50}
        df = pd.DataFrame([input_data])
        processed_df = self.engine.engineer_features(df)
        
        # Mock prepare_input to return a dataframe with columns
        with patch.object(self.engine, '_prepare_input_for_model') as mock_prep:
            # Return a DataFrame with 2 columns to match shap values shape (1, 2)
            mock_prep.return_value = pd.DataFrame([[1, 50]], columns=['seizures', 'csf_protein'])
            
            features = self.engine.calculate_shap(processed_df, is_positive_prediction=True, disease_type='AE')
            
            self.assertIsInstance(features, list)
            self.assertTrue(len(features) > 0)
            # Sorted by abs magnitude: -2.0 (csf_protein) > 1.0 (seizures)
            self.assertEqual(features[0]['label'], 'csf_protein') 
