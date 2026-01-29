import json
import os
import uuid
from django.conf import settings
from django.http import HttpResponse
from django.template.loader import get_template
from django.db.models import Q
from xhtml2pdf import pisa

from rest_framework import status
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, PatientProfile, DoctorProfile, DiagnosticSession, Appointment, Message
from .serializers import UserSerializer, DiagnosticSessionSerializer, AppointmentSerializer, MessageSerializer
from .services.ai_engine import HybridAIEngine


# ... existing imports ...
from .models import User, PatientProfile, DoctorProfile, DiagnosticSession, Appointment, Message, ContactQuery
from .serializers import UserSerializer, DiagnosticSessionSerializer, AppointmentSerializer, MessageSerializer, ContactQuerySerializer



# Initialize the AI Engine once
ai_engine = HybridAIEngine()

# ==========================================
# 1. AUTHENTICATION & PROFILE
# ==========================================

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    username = data.get('email')
    password = data.get('password')
    role = data.get('role')
    
    if User.objects.filter(username=username).exists():
        return Response({"error": "User already exists"}, status=400)
    
    user = User.objects.create_user(username=username, email=username, password=password)
    user.first_name = data.get('first_name', '')
    user.last_name = data.get('last_name', '')
    
    if role == 'doctor':
        user.is_doctor = True
        DoctorProfile.objects.create(user=user, specialization="General", medical_license_id="PENDING")
    else:
        user.is_patient = True
        PatientProfile.objects.create(user=user)
    
    user.save()
    return Response({"status": "success", "message": "User created successfully"})

api_view(['POST'])
@permission_classes([AllowAny])
def update_doctor_detail(request):
    email = request.data.get('email')
    if not email:
        return Response({"error": "Email required"}, status=400)
    try:
        user = User.objects.get(email=email)
        # Create profile if it doesn't exist
        profile, created = DoctorProfile.objects.get_or_create(user=user)
        
        # Update fields
        profile.specialization = request.data.get('specialization', profile.specialization)
        profile.medical_license_id = request.data.get('license_id', profile.medical_license_id)
        profile.hospital_name = request.data.get('hospital', profile.hospital_name)
        profile.years_experience = request.data.get('experience', profile.years_experience)
        profile.bio = request.data.get('bio', profile.bio)
        profile.consultation_fee = request.data.get('fee', profile.consultation_fee)
        profile.education_text = request.data.get('education', profile.education_text)
        profile.awards_text = request.data.get('awards', profile.awards_text)
        
        profile.save()
        return Response({"status": "success"})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role': 'doctor' if user.is_doctor else 'patient',
            'user_id': user.id,
            'name': f"{user.first_name} {user.last_name}"
        })
    else:
        return Response({"error": "Invalid credentials"}, status=401)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    email = request.data.get('email')
    if User.objects.filter(email=email).exists():
        return Response({"status": "success", "message": "Email found"})
    return Response({"error": "Email address not found"}, status=404)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({"error": "Missing fields"}, status=400)
        
    try:
        user = User.objects.get(email=email)
        user.set_password(password)
        user.save()
        return Response({"status": "success", "message": "Password updated"})
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
# ==========================================
# 1.5. PROFILE MANAGEMENT (MISSING FUNCTIONS)
# ==========================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile_data(request):
    """
    Fetches profile data for the logged-in user.
    """
    user = request.user
    data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "role": "doctor" if user.is_doctor else "patient"
    }
    
    try:
        if user.is_doctor:
            # Auto-create if missing
            if not hasattr(user, 'doctor_profile'):
                 DoctorProfile.objects.create(user=user, specialization="General", medical_license_id="PENDING")
            
            p = user.doctor_profile
            data.update({
                "specialization": p.specialization,
                "license_id": p.medical_license_id,
                "hospital": p.hospital_name,
                "experience": p.years_experience,
                "bio": p.bio,
                "fee": p.consultation_fee
            })
        elif user.is_patient:
            if not hasattr(user, 'patient_profile'):
                 PatientProfile.objects.create(user=user)
                 
            p = user.patient_profile
            data.update({
                "date_of_birth": p.date_of_birth,
                "blood_type": p.blood_type,
            })
    except Exception as e:
        print(f"Profile Error: {e}")
        # Return basic user data if profile fails
    
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile_data(request):
    """
    Updates the profile for the logged-in user.
    """
    user = request.user
    data = request.data
    
    # 1. Update Core User Fields
    user.first_name = data.get('first_name', user.first_name)
    user.last_name = data.get('last_name', user.last_name)
    user.save()
    
    # 2. Update Role-Specific Fields
    try:
        if user.is_doctor:
            if not hasattr(user, 'doctor_profile'):
                DoctorProfile.objects.create(user=user, specialization="General", medical_license_id="PENDING")
            
            p = user.doctor_profile
            p.specialization = data.get('specialization', p.specialization)
            p.hospital_name = data.get('hospital', p.hospital_name)
            p.years_experience = data.get('experience', p.years_experience)
            p.bio = data.get('bio', p.bio)
            p.consultation_fee = data.get('fee', p.consultation_fee)
            p.save()
            
        elif user.is_patient:
            if not hasattr(user, 'patient_profile'):
                PatientProfile.objects.create(user=user)
                
            p = user.patient_profile
            # Handle empty date strings safely
            dob = data.get('date_of_birth')
            if dob == "": dob = None
            
            p.date_of_birth = dob
            p.blood_type = data.get('blood_type', p.blood_type)
            p.save()
            
        return Response({"status": "success", "message": "Profile updated successfully"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

# ==========================================
# 2. PATIENT AI & DASHBOARD ENDPOINTS
# ==========================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def predict_disease(request):
    data = request.data
    disease_type = data.get('disease_type', 'AE')
    
    raw_clinical_data = data.get('clinical_data', '{}')
    if isinstance(raw_clinical_data, str):
        try:
            clinical_data = json.loads(raw_clinical_data)
        except json.JSONDecodeError:
            clinical_data = {}
    else:
        clinical_data = raw_clinical_data

    # 1. Save Session
    try:
        session = DiagnosticSession.objects.create(
            patient=request.user,
            disease_type=disease_type,
            clinical_data=clinical_data,
            mri_scan=request.FILES.get('mri_scan')
        )
    except Exception as e:
        return Response({"status": "error", "message": str(e)}, status=400)

    # 2. AI Prediction
    mri_path = session.mri_scan.path if session.mri_scan else None
    
    if disease_type == 'PV':
        ai_result = ai_engine.predict_pv_ensemble(session.clinical_data)
    else:
        ai_result = ai_engine.predict_ae_fusion(session.clinical_data, mri_path)

    # 3. Update DB
    session.prediction_result = ai_result.get('result')
    session.confidence_score = ai_result.get('confidence')
    session.ai_explanation_text = ai_result.get('explanation')
    
    if ai_result.get('full_data'):
        session.clinical_data = ai_result.get('full_data')
    
    session.status = 'completed'
    session.save()

    return Response({
        "status": "success",
        "data": {
            **DiagnosticSessionSerializer(session).data,
            "grad_cam_url": ai_result.get('grad_cam'),
            "shap_features": ai_result.get('shap_features')
        }
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patient_dashboard_stats(request):
    user = request.user
    recent_sessions = DiagnosticSession.objects.filter(patient=user).order_by('-created_at')[:3]
    recent_data = DiagnosticSessionSerializer(recent_sessions, many=True).data
    
    next_apt = Appointment.objects.filter(patient=user, status='upcoming').order_by('date_time').first()
    apt_data = {
        "date": next_apt.date_time.strftime("%b %d, %I:%M %p") if next_apt else "No upcoming appointments",
        "doctor": f"Dr. {next_apt.doctor.last_name}" if next_apt and hasattr(next_apt.doctor, 'last_name') else ""
    }

    total_count = DiagnosticSession.objects.filter(patient=user).count()

    return Response({
        "recent_sessions": recent_data,
        "next_appointment": apt_data,
        "total_reports": total_count
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patient_history(request):
    if request.user.is_doctor:
        return Response({"error": "Doctors use the registry."}, status=403)
    sessions = DiagnosticSession.objects.filter(patient=request.user).order_by('-created_at')
    return Response(DiagnosticSessionSerializer(sessions, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patient_appointments(request):
    appointments = Appointment.objects.filter(patient=request.user).order_by('date_time')
    data = []
    for apt in appointments:
        doc_name = f"Dr. {apt.doctor.first_name} {apt.doctor.last_name}"
        spec = "General"
        if hasattr(apt.doctor, 'doctor_profile'):
            spec = apt.doctor.doctor_profile.specialization
        data.append({
            "id": apt.id,
            "doctor_name": doc_name,
            "specialization": spec,
            "date": apt.date_time.strftime("%Y-%m-%d"),
            "time": apt.date_time.strftime("%H:%M"),
            "status": apt.status,
            "meet_link": apt.meet_link
        })
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_appointment(request):
    doctor_id = request.data.get('doctor_id')
    date_time = request.data.get('date_time')
    
    if not doctor_id or not date_time:
        return Response({"error": "Missing doctor or date"}, status=400)

    try:
        doctor = User.objects.get(id=doctor_id, is_doctor=True)
        room_id = f"consult-{request.user.id}-{doctor.id}-{uuid.uuid4().hex[:6]}"
        
        Appointment.objects.create(
            patient=request.user,
            doctor=doctor,
            date_time=date_time,
            status='upcoming',
            meet_link=room_id
        )
        return Response({"status": "success", "message": "Appointment booked", "roomId": room_id})
    except User.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_pdf_report(request, session_id):
    try:
        session = DiagnosticSession.objects.get(id=session_id)
        if not request.user.is_doctor and session.patient != request.user:
            return Response({"error": "Unauthorized"}, status=403)
            
        disease_type = session.disease_type # 'AE' or 'PV'

        # --- Filtered Clinical Data for PDF ---
        formatted_clinical_data = []
        if session.clinical_data:
            # Define relevant keys for each disease
            ae_keys = ['age', 'sex', 'pain_score', 'seizures', 'memory_loss', 'csf_protein', 'csf_cells', 'antibody_titer', 'neuro_score', 'csf_ratio', 'imaging_score']
            pv_keys = ['age', 'sex', 'pain_score', 'skin_blisters', 'mucosal_ulcers', 'dsg1_index', 'dsg3_index', 'skin_score']
            
            target_keys = ae_keys if disease_type == 'AE' else pv_keys
            
            for key, value in session.clinical_data.items():
                # Only include keys relevant to the disease (and skip internal ones)
                if key not in target_keys:
                    continue
                
                status_label = "Normal"
                status_color = "dot-green"
                
                try:
                    val = float(value)
                    if 'protein' in key and val > 45: status_label, status_color = "High", "dot-red"
                    elif 'cell' in key and val > 5: status_label, status_color = "Elevated", "dot-red"
                    elif 'titer' in key and val > 10: status_label, status_color = "High", "dot-red"
                    elif 'index' in key and val > 20: status_label, status_color = "Positive", "dot-red"
                    elif 'blisters' in key and val > 0: status_label, status_color = "Present", "dot-red"
                    elif 'seizures' in key and val > 0: status_label, status_color = "Present", "dot-red"
                except: pass

                formatted_clinical_data.append({
                    "name": key.replace('_', ' ').title(),
                    "value": value,
                    "status_label": status_label,
                    "status_color": status_color
                })

        context = {
            "patient_name": f"{session.patient.first_name} {session.patient.last_name}",
            "patient_id": session.patient.id,
            "date": session.created_at.strftime("%Y-%m-%d"),
            "session_id": session.id,
            "disease_type": "Autoimmune Encephalitis" if disease_type == 'AE' else "Pemphigus Vulgaris",
            "result": session.prediction_result,
            "confidence": session.confidence_score,
            "explanation": session.ai_explanation_text,
            "formatted_clinical_data": formatted_clinical_data, # Use the filtered list
            "grad_cam_path": None,
            "doctor_notes": session.doctor_notes,
            "status": session.status.upper()
        }
        
        # Handle GradCAM only for AE
        if session.disease_type == 'AE' and session.mri_scan:
             filename = f"gradcam_{os.path.basename(session.mri_scan.name)}"
             full_path = os.path.join(settings.MEDIA_ROOT, 'grad_cam', filename)
             if os.path.exists(full_path):
                 context['grad_cam_path'] = full_path

        template_path = 'report_template.html'
        template = get_template(template_path)
        html = template.render(context)
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="Report_{session_id}.pdf"'
        pisa_status = pisa.CreatePDF(html, dest=response)
        
        if pisa_status.err: return Response({"error": "PDF generation failed"}, status=500)
        return response
    except DiagnosticSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
# ==========================================
# 3. DOCTOR ENDPOINTS
# ==========================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_doctor_patients(request):
    sessions = DiagnosticSession.objects.all().order_by('-created_at')
    data = []
    for s in sessions:
        s_data = DiagnosticSessionSerializer(s).data
        if s.disease_type == 'AE' and s.mri_scan:
            gradcam_filename = f"gradcam_{os.path.basename(s.mri_scan.name)}"
            s_data['grad_cam_url'] = f"/media/grad_cam/{gradcam_filename}"
        data.append(s_data)
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_session_detail(request, session_id):
    try:
        session = DiagnosticSession.objects.get(id=session_id)
        data = DiagnosticSessionSerializer(session).data
        if session.disease_type == 'AE' and session.mri_scan:
            gradcam_filename = f"gradcam_{os.path.basename(session.mri_scan.name)}"
            data['grad_cam_url'] = f"/media/grad_cam/{gradcam_filename}"
        return Response(data)
    except DiagnosticSession.DoesNotExist:
        return Response({"error": "Not found"}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_diagnosis(request, session_id):
    try:
        session = DiagnosticSession.objects.get(id=session_id)
    except DiagnosticSession.DoesNotExist:
        return Response({"error": "Session not found"}, status=404)
    
    data = request.data
    session.status = data.get('status', session.status)
    session.doctor_notes = data.get('notes', '')
    session.reviewed_by = request.user 
    session.save()
    return Response({"status": "success", "message": "Diagnosis verified"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_doctor_appointments(request):
    appointments = Appointment.objects.filter(doctor=request.user).order_by('date_time')
    data = []
    for apt in appointments:
        data.append({
            "id": apt.id,
            "patient_name": f"{apt.patient.first_name} {apt.patient.last_name}",
            "patient_id": apt.patient.id,
            "date": apt.date_time.strftime("%Y-%m-%d"),
            "time": apt.date_time.strftime("%H:%M"),
            "status": apt.status,
            "meet_link": apt.meet_link
        })
    return Response(data)

# ==========================================
# 4. MESSAGING & VIDEO ENDPOINTS
# ==========================================

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_history(request, user_id):
    current_user = request.user
    messages = Message.objects.filter(
        Q(sender=current_user, receiver_id=user_id) | 
        Q(sender_id=user_id, receiver=current_user)
    ).order_by('timestamp')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    receiver_id = request.data.get('receiver_id')
    content = request.data.get('content')
    if not receiver_id or not content:
        return Response({"error": "Missing fields"}, status=400)
    try:
        receiver = User.objects.get(id=receiver_id)
        message = Message.objects.create(sender=request.user, receiver=receiver, content=content)
        return Response(MessageSerializer(message).data)
    except User.DoesNotExist:
        return Response({"error": "Receiver not found"}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_contacts(request):
    user = request.user
    contacts = []
    if user.is_patient:
        doctors = User.objects.filter(is_doctor=True)
        for doc in doctors:
            contacts.append({
                "id": doc.id,
                "name": f"Dr. {doc.first_name} {doc.last_name}",
                "role": "Specialist"
            })
    else:
        # Doctor sees patients they have sessions or appointments with
        pats = User.objects.filter(id__in=DiagnosticSession.objects.values_list('patient_id', flat=True).distinct())
        for pat in pats:
            contacts.append({"id": pat.id, "name": f"{pat.first_name} {pat.last_name}", "role": "Patient"})
    return Response(contacts)

# ==========================================
# 5. PUBLIC DOCTOR PROFILES (Find Doctor)
# ==========================================

@api_view(['GET'])
@permission_classes([AllowAny]) 
def get_all_doctors(request):
    doctors = User.objects.filter(is_doctor=True)
    data = []
    for doc in doctors:
        try:
            if not hasattr(doc, 'doctor_profile'):
                 DoctorProfile.objects.create(user=doc, specialization="General", medical_license_id="PENDING")
            
            profile = getattr(doc, 'doctor_profile', None)
            
            data.append({
                "id": doc.id,
                "name": f"Dr. {doc.first_name} {doc.last_name}",
                "spec": getattr(profile, 'specialization', "General"),
                "hospital": getattr(profile, 'hospital_name', "ImmunoAI Clinic"),
                "rating": 4.9, 
                "reviews": 15,
                "fee": f"${getattr(profile, 'consultation_fee', 50)}",
                "location": "Lahore, Pakistan",
                "img": doc.profile_picture.url if doc.profile_picture else "https://ui-avatars.com/api/?name=" + doc.first_name + "+" + doc.last_name + "&background=0D8ABC&color=fff",
                "bio": getattr(profile, 'bio', "No bio available."),
                "experience": getattr(profile, 'years_experience', 5),
                "availability": "Available Today" 
            })
        except Exception as e:
            print(f"Skipping doctor {doc.id}: {e}")
            continue
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny]) 
def get_doctor_detail(request, doctor_id):
    try:
        doc = User.objects.get(id=doctor_id, is_doctor=True)
        if not hasattr(doc, 'doctor_profile'):
             DoctorProfile.objects.create(user=doc, specialization="General", medical_license_id="PENDING")

        profile = getattr(doc, 'doctor_profile', None)
        
        data = {
            "id": doc.id,
            "name": f"Dr. {doc.first_name} {doc.last_name}",
            "role": getattr(profile, 'specialization', ""),
            "hospital": getattr(profile, 'hospital_name', ""),
            "location": "Lahore, PK",
            "rating": 4.8,
            "reviews": 42,
            "experience": getattr(profile, 'years_experience', 0),
            "patients": "100+",
            "successRate": "95%",
            "fee": f"${getattr(profile, 'consultation_fee', 50)}",
            "about": getattr(profile, 'bio', ""),
            "education": [
                { "degree": "MBBS", "school": "King Edward Medical University", "year": "2015" },
                { "degree": "FCPS", "school": "CPSP", "year": "2020" }
            ],
            "achievements": ["Certified Specialist", "Top Rated 2024"],
            "affiliations": getattr(profile, 'hospital_name', "")
        }
        return Response(data)
    except User.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)
    
# ... (Keep existing AI engine init and other views) ...

# ==========================================
# 6. GENERAL / PUBLIC ENDPOINTS
# ==========================================

@api_view(['POST'])
@permission_classes([AllowAny])
def submit_contact_query(request):
    serializer = ContactQuerySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"status": "success", "message": "Message sent successfully!"})
    return Response(serializer.errors, status=400)