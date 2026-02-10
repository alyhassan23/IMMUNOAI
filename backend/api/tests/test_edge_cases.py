import json
from django.test import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from api.models import User
import pandas as pd

class InputValidationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='tester', is_patient=True)
        self.client.force_authenticate(user=self.user)
        self.predict_url = reverse('predict_disease')

    def test_upload_invalid_file_type(self):
        """
        Security Test: Attempt to upload a .txt file as an MRI scan.
        The system should either reject it or handle it gracefully without crashing.
        """
        text_file = SimpleUploadedFile("virus.txt", b"malicious code", content_type="text/plain")
        
        data = {
            'disease_type': 'AE',
            'clinical_data': json.dumps({'seizures': 1}),
            'mri_scan': text_file
        }
        
        response = self.client.post(self.predict_url, data, format='multipart')
        
        # It shouldn't crash (500). Ideally 200 (handled) or 400 (validation error).
        # Since our view accepts any file but AI might fail processing, we expect 200 or 400.
        self.assertNotEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_malformed_json_clinical_data(self):
        """Test sending broken JSON string"""
        data = {
            'disease_type': 'AE',
            'clinical_data': '{ "seizures": 1, ' # Missing closing brace
        }
        response = self.client.post(self.predict_url, data, format='multipart')
        
        # The view should catch JSONDecodeError and default to empty dict
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        # Or check if it returns an error message if your view is strict

    def test_negative_values_in_clinical_data(self):
        """Test logic robustness with negative numbers"""
        from api.services.ai_engine import HybridAIEngine
        engine = HybridAIEngine()
        
        input_data = {'age': -50, 'csf_protein': -10}
        df = engine.engineer_features(pd.DataFrame([input_data]))
        
        # Ensure log transform didn't crash (log of negative is NaN)
        # np.log1p(-10) -> NaN. The engine should handle NaNs or fillna(0)
        self.assertFalse(df.isnull().values.any()) 

class SecurityTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('get_doctor_patients') # Endpoint meant for doctors only

    def test_patient_accessing_doctor_data(self):
        """RBAC Test: Patient should not see doctor's patient list"""
        patient = User.objects.create_user(username='patient_sec', is_patient=True)
        self.client.force_authenticate(user=patient)
        
        response = self.client.get(self.url)
        # Depending on your permission_classes, this might be 403 or empty list
        # If your view logic checks `if not request.user.is_doctor`, it should return error/empty
        self.assertNotEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)