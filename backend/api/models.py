from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now

# 1. Custom User Model
class User(AbstractUser):
    is_patient = models.BooleanField(default=False)
    is_doctor = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profiles/', null=True, blank=True)

    def __str__(self):
        return self.username

# 2. Patient & Doctor Profiles
class PatientProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    date_of_birth = models.DateField(null=True, blank=True)
    blood_type = models.CharField(max_length=5, blank=True)

    def __str__(self):
        return f"Patient: {self.user.username}"

class DoctorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization = models.CharField(max_length=100)
    medical_license_id = models.CharField(max_length=50)
    is_verified = models.BooleanField(default=False)
    consultation_fee = models.DecimalField(max_digits=6, decimal_places=2, default=50.00)
    
    # --- INFO FORM FIELDS ---
    hospital_name = models.CharField(max_length=200, blank=True)
    years_experience = models.IntegerField(default=0)
    bio = models.TextField(blank=True)
    education_text = models.TextField(blank=True, help_text="Comma separated degrees") # NEW
    awards_text = models.TextField(blank=True, help_text="Comma separated awards") # NEW

    def __str__(self):
        return f"Dr. {self.user.username} ({self.specialization})"

# 3. Diagnostic Session
class DiagnosticSession(models.Model):
    DISEASE_CHOICES = [('AE', 'Autoimmune Encephalitis'), ('PV', 'Pemphigus Vulgaris')]
    STATUS_CHOICES = [('pending', 'Analysis Running'), ('completed', 'AI Result Ready'), ('verified', 'Verified'), ('rejected', 'Rejected')]

    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='diagnostic_sessions')
    disease_type = models.CharField(max_length=2, choices=DISEASE_CHOICES)
    created_at = models.DateTimeField(default=now)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    clinical_data = models.JSONField(default=dict) 
    mri_scan = models.ImageField(upload_to='mri_scans/', null=True, blank=True)
    prediction_result = models.CharField(max_length=50, blank=True)
    confidence_score = models.FloatField(null=True, blank=True)
    ai_explanation_text = models.TextField(blank=True)
    
    # Store Grad-CAM path string if needed, though we generate on fly usually
    # Adding a field to persist it if we want to be safe
    # grad_cam_image = models.ImageField(upload_to='grad_cam/', null=True, blank=True) 

    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews')
    doctor_notes = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.disease_type} - {self.patient.username}"

# 4. Appointments
class Appointment(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments_as_patient')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments_as_doctor')
    date_time = models.DateTimeField()
    status = models.CharField(max_length=20, default='upcoming')
    meet_link = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Appt: {self.patient.username} with {self.doctor.username}"

# 5. Messaging
class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp']



# 6. Contact Form Queries (NEW)
class ContactQuery(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"Query from {self.first_name} {self.last_name}"