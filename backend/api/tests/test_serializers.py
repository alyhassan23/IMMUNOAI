from django.test import TestCase
from api.models import User, DiagnosticSession
from api.serializers import UserSerializer, DiagnosticSessionSerializer

class SerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com', first_name='Test', last_name='User', is_patient=True)
        self.session = DiagnosticSession.objects.create(patient=self.user, disease_type='AE')

    def test_user_serializer(self):
        serializer = UserSerializer(self.user)
        data = serializer.data
        self.assertEqual(data['username'], 'testuser')
        self.assertEqual(data['email'], 'test@example.com')
        self.assertEqual(data['is_patient'], True)

    def test_diagnostic_session_serializer(self):
        serializer = DiagnosticSessionSerializer(self.session)
        data = serializer.data
        self.assertEqual(data['disease_type'], 'AE')
        self.assertEqual(data['patient_name'], 'Test User')
        self.assertEqual(data['patient_email'], 'test@example.com')
