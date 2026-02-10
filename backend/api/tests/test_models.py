from django.test import TestCase
from api.models import User, PatientProfile, DoctorProfile, DiagnosticSession, Appointment
from django.utils import timezone

class UserModelTest(TestCase):
    def test_create_patient(self):
        user = User.objects.create_user(username='patient1', email='patient1@example.com', password='password123', is_patient=True)
        self.assertTrue(user.is_patient)
        self.assertFalse(user.is_doctor)
        self.assertEqual(str(user), 'patient1')

    def test_create_doctor(self):
        user = User.objects.create_user(username='doctor1', email='doctor1@example.com', password='password123', is_doctor=True)
        self.assertTrue(user.is_doctor)
        self.assertFalse(user.is_patient)

class ProfileModelTest(TestCase):
    def setUp(self):
        self.patient_user = User.objects.create_user(username='patient2', is_patient=True)
        self.doctor_user = User.objects.create_user(username='doctor2', is_doctor=True)

    def test_patient_profile(self):
        profile = PatientProfile.objects.create(user=self.patient_user, blood_type='O+')
        self.assertEqual(profile.user, self.patient_user)
        self.assertEqual(str(profile), 'Patient: patient2')

    def test_doctor_profile(self):
        profile = DoctorProfile.objects.create(user=self.doctor_user, specialization='Neurology')
        self.assertEqual(profile.user, self.doctor_user)
        self.assertEqual(profile.specialization, 'Neurology')
        self.assertTrue(str(profile).startswith('Dr. doctor2'))

class DiagnosticSessionModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='patient3', is_patient=True)

    def test_create_session(self):
        session = DiagnosticSession.objects.create(patient=self.user, disease_type='AE', clinical_data={'seizures': 1})
        self.assertEqual(session.patient, self.user)
        self.assertEqual(session.disease_type, 'AE')
        self.assertEqual(session.status, 'pending')
        self.assertEqual(str(session), 'AE - patient3')

class AppointmentModelTest(TestCase):
    def setUp(self):
        self.patient = User.objects.create_user(username='patient4', is_patient=True)
        self.doctor = User.objects.create_user(username='doctor4', is_doctor=True)

    def test_create_appointment(self):
        now = timezone.now()
        appointment = Appointment.objects.create(patient=self.patient, doctor=self.doctor, date_time=now)
        self.assertEqual(appointment.patient, self.patient)
        self.assertEqual(appointment.doctor, self.doctor)
        self.assertEqual(appointment.status, 'upcoming')
        self.assertTrue(str(appointment).startswith('Appt: patient4 with doctor4'))
