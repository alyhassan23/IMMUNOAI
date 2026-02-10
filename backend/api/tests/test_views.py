from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import User, DiagnosticSession, Appointment, DoctorProfile, PatientProfile, Message
from unittest.mock import patch

class ComprehensiveViewTests(APITestCase):
    def setUp(self):
        # Create Users
        self.patient = User.objects.create_user(username='pat', email='pat@test.com', password='pw', is_patient=True)
        self.doctor = User.objects.create_user(username='doc', email='doc@test.com', password='pw', is_doctor=True)
        self.doctor_profile = DoctorProfile.objects.create(user=self.doctor, specialization="Neuro")
        
        # Create Data
        self.session = DiagnosticSession.objects.create(patient=self.patient, disease_type='AE', clinical_data={'seizures': 1})
        self.appointment = Appointment.objects.create(patient=self.patient, doctor=self.doctor, date_time="2025-01-01T12:00:00Z")

    # --- AUTH & PROFILE TESTS ---
    def test_get_update_profile(self):
        self.client.force_authenticate(user=self.patient)
        
        # GET Profile
        resp = self.client.get(reverse('get_profile_data'))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        
        # UPDATE Profile
        resp = self.client.post(reverse('update_profile_data'), {'first_name': 'NewName', 'date_of_birth': '2000-01-01'})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.patient.refresh_from_db()
        self.assertEqual(self.patient.first_name, 'NewName')

    def test_update_doctor_details(self):
        # Public endpoint
        data = {'email': 'doc@test.com', 'specialization': 'Immuno', 'fee': 100}
        resp = self.client.post(reverse('update_doctor_detail'), data)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.doctor.doctor_profile.refresh_from_db()
        self.assertEqual(self.doctor.doctor_profile.consultation_fee, 100)

    # --- APPOINTMENT FLOW TESTS ---
    def test_doctor_appointment_actions(self):
        self.client.force_authenticate(user=self.doctor)
        
        # Get List
        resp = self.client.get(reverse('get_doctor_appointments'))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        
        # Complete
        resp = self.client.post(reverse('complete_appointment'), {'appointment_id': self.appointment.id})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.status, 'completed')

    def test_patient_appointment_actions(self):
        self.client.force_authenticate(user=self.patient)
        
        # Reschedule
        resp = self.client.post(reverse('reschedule_appointment'), {
            'appointment_id': self.appointment.id, 
            'new_date': '2025-02-01T12:00:00Z'
        })
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        
        # Cancel
        resp = self.client.post(reverse('cancel_appointment'), {'appointment_id': self.appointment.id})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.appointment.refresh_from_db()
        self.assertEqual(self.appointment.status, 'cancelled')

    # --- DIAGNOSIS & DOCTOR DASHBOARD ---
    def test_doctor_verify_diagnosis(self):
        self.client.force_authenticate(user=self.doctor)
        
        # Get Patient List
        resp = self.client.get(reverse('get_doctor_patients'))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        
        # Verify Session
        resp = self.client.post(reverse('verify_diagnosis', args=[self.session.id]), {
            'status': 'verified',
            'notes': 'Confirmed AE'
        })
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.session.refresh_from_db()
        self.assertEqual(self.session.doctor_notes, 'Confirmed AE')

    # --- CHAT & CONTACTS ---
    def test_chat_flow(self):
        self.client.force_authenticate(user=self.patient)
        
        # Send Message
        resp = self.client.post(reverse('send_message'), {
            'receiver_id': self.doctor.id,
            'content': 'Hello Doc'
        })
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        
        # Get History
        resp = self.client.get(reverse('get_chat_history', args=[self.doctor.id]))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)
        
        # Get Contacts
        resp = self.client.get(reverse('get_contacts'))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    # --- PUBLIC ENDPOINTS ---
    def test_public_endpoints(self):
        # Get all doctors
        resp = self.client.get(reverse('get_all_doctors'))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        
        # Contact Form
        resp = self.client.post(reverse('submit_contact_query'), { 'first_name': 'Guest', 'last_name': 'User', 'email': 'g@g.com', 'message': 'Hi'})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)