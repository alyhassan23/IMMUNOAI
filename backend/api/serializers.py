from rest_framework import serializers
from .models import User, PatientProfile, DoctorProfile, DiagnosticSession, Appointment
from .models import User, PatientProfile, DoctorProfile, DiagnosticSession, Appointment, Message # Import Message

from rest_framework import serializers
from .models import User, PatientProfile, DoctorProfile, DiagnosticSession, Appointment, Message, ContactQuery

# ... (Keep existing serializers) ...

class ContactQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactQuery
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_patient', 'is_doctor']

class DiagnosticSessionSerializer(serializers.ModelSerializer):
    patient_name = serializers.SerializerMethodField()
    patient_email = serializers.SerializerMethodField() # NEW

    class Meta:
        model = DiagnosticSession
        fields = '__all__'

    def get_patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"

    def get_patient_email(self, obj): # NEW
        return obj.patient.email

class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.username', read_only=True)
    doctor_name = serializers.CharField(source='doctor.username', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'




# ... existing serializers ...

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'content', 'timestamp', 'is_read', 'sender_name']

    def get_sender_name(self, obj):
        return f"{obj.sender.first_name} {obj.sender.last_name}"
    

from rest_framework import serializers
from .models import Appointment
from django.contrib.auth.models import User

class UserBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_details = UserBriefSerializer(source='doctor', read_only=True)
    patient_details = UserBriefSerializer(source='patient', read_only=True)
    
    class Name:
        model = Appointment
        fields = '__all__'

class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)  # Nested User Data
    
    class Meta:
        model = DoctorProfile
        fields = [
            'id', 'user', 'specialization', 'hospital_name', 
            'years_experience', 'bio', 'consultation_fee', 
            'education_text', 'awards_text', 'medical_license_id', 
            'is_verified', 'rating', 'reviews_count'
        ]
        # Note: I added 'rating' and 'reviews_count' to fields just in case you added them to models. 
        # If not in models, remove them or add them to models.py as well.
        # For now, assuming they might be computed fields or simple fields. 
        # If they don't exist in your model yet, remove them from this list to avoid errors.
