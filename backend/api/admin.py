from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, PatientProfile, DoctorProfile, DiagnosticSession, Appointment, Message

# 1. User Management
class CustomUserAdmin(UserAdmin):
    model = User
    # Showing key fields in the list
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_doctor', 'is_patient', 'is_staff')
    list_filter = ('is_doctor', 'is_patient', 'is_staff', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    
    # Allow editing these fields in the detail view
    fieldsets = UserAdmin.fieldsets + (
        ('Role Info', {'fields': ('is_patient', 'is_doctor', 'profile_picture')}),
    )

# 2. Patient Profile
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'date_of_birth', 'blood_type')
    search_fields = ('user__username', 'user__email')
    # No readonly_fields means everything is editable

# 3. Doctor Profile
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'hospital_name', 'is_verified', 'years_experience', 'consultation_fee')
    list_filter = ('is_verified', 'specialization')
    search_fields = ('user__username', 'hospital_name', 'medical_license_id')
    
    # Allow quick verification from the list
    list_editable = ('is_verified',) 

# 4. Diagnostic Sessions (AI Reports)
class DiagnosticSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient_name', 'disease_type', 'prediction_result', 'confidence_score', 'status', 'created_at')
    list_filter = ('disease_type', 'status', 'created_at')
    search_fields = ('patient__username', 'patient__email', 'prediction_result')
    
    # Make everything editable except the creation timestamp (auto-generated)
    readonly_fields = ('created_at',) 

    def patient_name(self, obj):
        return obj.patient.get_full_name() or obj.patient.username

# 5. Appointments
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient_name', 'doctor_name', 'date_time', 'status', 'meet_link')
    list_filter = ('status', 'date_time')
    search_fields = ('patient__username', 'doctor__username')
    
    # Allow status updates directly from the list
    list_editable = ('status',)

    def patient_name(self, obj):
        return obj.patient.get_full_name()
    def doctor_name(self, obj):
        return f"Dr. {obj.doctor.get_full_name()}"

# 6. Messages
class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'short_content', 'timestamp', 'is_read')
    list_filter = ('timestamp', 'is_read')
    search_fields = ('sender__username', 'receiver__username', 'content')
    
    # Allow editing message content if needed (usually messages are immutable, but for admin control we allow it)
    # Removing readonly_fields to allow edits

    def short_content(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content

# Registering models
admin.site.register(User, CustomUserAdmin)
admin.site.register(PatientProfile, PatientProfileAdmin)
admin.site.register(DoctorProfile, DoctorProfileAdmin)
admin.site.register(DiagnosticSession, DiagnosticSessionAdmin)
admin.site.register(Appointment, AppointmentAdmin)
admin.site.register(Message, MessageAdmin)

# --- BRANDING ---
admin.site.site_header = "ImmunoAI Administration"
admin.site.site_title = "ImmunoAI Admin Portal"
admin.site.index_title = "Welcome to ImmunoAI Control Center"


# ... existing imports ...
from .models import User, PatientProfile, DoctorProfile, DiagnosticSession, Appointment, Message, ContactQuery

# ... (Keep existing Admin classes) ...

class ContactQueryAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'created_at', 'is_resolved')
    list_filter = ('created_at', 'is_resolved')
    search_fields = ('first_name', 'last_name', 'email', 'message')
    readonly_fields = ('created_at',)
    list_editable = ('is_resolved',)

admin.site.register(ContactQuery, ContactQueryAdmin)
# ... (Keep other registrations) ...