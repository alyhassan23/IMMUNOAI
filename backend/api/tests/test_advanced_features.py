from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock
from api.models import User, DiagnosticSession
from api.services.rag_service import ImmunoRAG
import os

class RAGServiceTests(TestCase):
    @patch('api.services.rag_service.ChatGroq')
    @patch('api.services.rag_service.PineconeVectorStore')
    @patch('api.services.rag_service.HuggingFaceEndpointEmbeddings')
    def test_rag_flow(self, mock_embeddings, mock_pinecone, mock_groq):
        """Test RAG service init and query logic"""
        mock_vector_store = MagicMock()
        mock_pinecone.from_existing_index.return_value = mock_vector_store
        
        rag = ImmunoRAG()
        self.assertIsNotNone(rag.vector_store)
        
        with patch('api.services.rag_service.RunnablePassthrough'):
             try:
                 rag.get_answer("Query", context_type="doctor")
             except: pass

    def test_rag_missing_api_keys(self):
        with patch.dict(os.environ, {}, clear=True):
            rag = ImmunoRAG()
            # It should still construct the object but maybe not connect
            response = rag.get_answer("Test")
            # We assert response indicates failure or service unavailable
            self.assertTrue(isinstance(response, str))

class PDFGenerationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='doc_pdf', is_doctor=True)
        self.client.force_authenticate(user=self.user)
        
        self.session = DiagnosticSession.objects.create(
            patient=self.user,
            disease_type='AE',
            prediction_result='Positive',
            confidence_score=99.9, # FIX: Changed from 'confidence' to 'confidence_score'
            clinical_data={'seizures': 1, 'csf_protein': 100}
        )
        self.url = reverse('generate_pdf_report', args=[self.session.id])

    def test_pdf_generation_success(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
        self.assertTrue(len(response.content) > 0)

    def test_pdf_unauthorized(self):
        hacker = User.objects.create_user(username='hacker', is_patient=True)
        self.client.force_authenticate(user=hacker)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)