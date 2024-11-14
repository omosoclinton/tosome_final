from django.urls import path, include
from . import views
from .views import StudentRegisterView, CreateUserAndTutorView, UserView, TutorView, TutorProfileView
from .views import AvailableSessionView, ProfileDetailView, AllAvailableSessionsView, BookSessionView
from .views import StudentBookedSessionsView, TutorBookedSessionsView, ConfirmBookingView, CompleteSessionView
from .views import AddSessionLinkView
urlpatterns = [
    path('home/', views.home, name='home'),
    path('get-user/', UserView.as_view(), name="get-user" ),
    path('student-register/', StudentRegisterView.as_view()),
    path('register-tutor/', CreateUserAndTutorView.as_view()),
    path('get-tutor-profile/', TutorView.as_view(), name='get-tutor-profile'),
    path('tutor-profile/', TutorProfileView.as_view(), name='tutor-profile'),
    path('create-session/', AvailableSessionView.as_view()),
    path('available-sessions/<int:pk>/delete/', AvailableSessionView.as_view(), name='delete_available_session'),
    path('available-sessions/<int:pk>/update/', AvailableSessionView.as_view(), name='available-session-detail'),
    path('all-sessions/', AllAvailableSessionsView.as_view()),
    path('profile/', ProfileDetailView.as_view(), name='profile-detail'),
    path('booked-sessions/', BookSessionView.as_view()),
    path('student-booked-sessions/', StudentBookedSessionsView.as_view()),
    path('tutor-booked-sessions/', TutorBookedSessionsView.as_view()),
    path('confirm-booked-session/<int:pk>/', ConfirmBookingView.as_view()),
    path('sessions/<int:pk>/complete/', CompleteSessionView.as_view()),
    path('sessions/<int:session_id>/add-link/', AddSessionLinkView.as_view()),
]