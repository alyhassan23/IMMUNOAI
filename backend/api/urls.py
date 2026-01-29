from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.register_user, name='register'),
    path('auth/update-doctor/', views.update_doctor_detail, name='update_doctor'),
    path('auth/login/', views.login_user, name='login'),
    
    # NEW: Password Reset Routes
    path('auth/verify-email/', views.verify_email, name='verify_email'),
    path('auth/reset-password/', views.reset_password, name='reset_password'),

    # Patient
    path('predict/', views.predict_disease, name='predict_disease'),
    path('patient/history/', views.get_patient_history, name='patient_history'),
    path('patient/dashboard-stats/', views.get_patient_dashboard_stats, name='dashboard_stats'),
    path('patient/appointments/', views.get_patient_appointments, name='patient_appointments'),
    path('patient/book-appointment/', views.book_appointment, name='book_appointment'),
    path('report/pdf/<int:session_id>/', views.generate_pdf_report, name='generate_pdf'),

    # Doctor
    path('doctor/patients/', views.get_doctor_patients, name='doctor_patients'),
    path('doctor/session/<int:session_id>/', views.get_session_detail, name='session_detail'),
    path('doctor/verify/<int:session_id>/', views.verify_diagnosis, name='verify_diagnosis'),
    path('doctor/appointments/', views.get_doctor_appointments, name='doctor_appointments'),
    path('doctors/<int:pk>/', views.get_doctor_detail, name='get_doctor_detail'),

    # Public / Doctor Listings
    path('public/doctors/', views.get_all_doctors, name='public_doctors'),
    path('public/doctors/<int:doctor_id>/', views.get_doctor_detail, name='public_doctor_detail'),

    # Messaging
    path('chat/contacts/', views.get_contacts, name='chat_contacts'),
    path('chat/history/<int:user_id>/', views.get_chat_history, name='chat_history'),
    path('chat/send/', views.send_message, name='chat_send'),
     path('profile/get/', views.get_profile_data, name='get_profile'),
    path('profile/update/', views.update_profile_data, name='update_profile'),
     # Contact Form
    path('contact/submit/', views.submit_contact_query, name='submit_contact_query'),
]