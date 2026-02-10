import json
from django.test import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch
from api.models import User, DiagnosticSession

class AuthIntegrationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register_user')
        self.login_url = reverse('login_user')

    def test_registration_and_login(self):
        """Test full auth flow"""
        user_data = {
            'email': 'test@example.com',
            'password': 'testpassword123',
            'role': 'patient',
            'first_name': 'Test',
            'last_name': 'User'
        }
        
        # 1. Register
        response = self.client.post(self.register_url, user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # 2. Login
        response = self.client.post(self.login_url, {
            'email': 'test@example.com',
            'password': 'testpassword123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

class PredictionEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='patient@example.com', 
            password='password123',
            username='patient@example.com',
            is_patient=True
        )
        self.client.force_authenticate(user=self.user)
        self.predict_url = reverse('predict_disease')

    @patch('api.views.ai_engine')  # Mock the AI Engine in views.py
    def test_predict_disease_endpoint(self, mock_ai_engine):
        """
        Integration test for prediction. Mocks the heavy AI engine.
        """
        # Setup mock return
        mock_ai_engine.predict_ae_fusion.return_value = {
            "result": "Positive for AE",
            "confidence": 85.5,
            "explanation": "Test explanation",
            "grad_cam": None,
            "shap_features": [],
            "full_data": {}
        }

        # Create dummy image
        image = SimpleUploadedFile("brain.jpg", b"file_content", content_type="image/jpeg")
        
        data = {
            'disease_type': 'AE',
            'clinical_data': json.dumps({'seizures': 1}),
            'mri_scan': image
        }

        response = self.client.post(self.predict_url, data, format='multipart')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['data']['prediction_result'], "Positive for AE")
        
        # Check Database
        session = DiagnosticSession.objects.get(patient=self.user)
        self.assertEqual(session.disease_type, 'AE')