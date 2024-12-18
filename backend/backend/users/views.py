from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, generics, response
from.serializers import BookedSessionSerializer, TutorBookedSessionSerializer, StudentBookedSessionSerializer
from .serializers import RegisterSerializer, TutorProfileSerializer, AvailableSessionSerializer, ProfileSerializer
from .models import TutorProfile, AvailableSession, BookedSession, Feedback
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .serializers import SessionLinkSerializer, FeedbackSerializer, TutorFeedbackSerializer
from django.db.models import Q
from django.contrib.auth import authenticate, logout
# Create your views here.

### NOT VERY IMPORTANT BUT YEAH

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = authenticate(username=request.data['username'], password=request.data['password'])
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        return Response({"message": "Invalid credentials"}, status=400)

    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out succesfully"}, status=status.HTTP_205_RESET_CONTENT)
    
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class UserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        serializer = RegisterSerializer(user)
        return Response(serializer.data, status=200)

class TutorView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        try:
            tutor = TutorProfile.objects.get(user=request.user.id)
            serializer = TutorProfileSerializer(tutor)
            return Response(serializer.data, status=200)
        except TutorProfile.DoesNotExist:
            return Response({"detail": "No tutor profile for the user"}, status=404)
        except Exception as e:
            return Response({"detail": str(e)}, status=500)


class TutorProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            tutor_profile = TutorProfile.objects.get(user=request.user)
            return Response({"subjects": tutor_profile.subjects}, status=status.HTTP_200_OK)
        except TutorProfile.DoesNotExist:
            return Response({"error": "Tutor profile not found."}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = TutorProfileSerializer(data=data, context={'request': request})  # Pass context here

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = TutorProfileSerializer(data=data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)




class StudentRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(request.data['password'])
            user.save()
            
            return Response({"message": "User registered succesfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=400)
    
    def get(self, request):
        users = get_user_model().objects.filter(user_type='student')
        serializer = RegisterSerializer(users, many=True)
        return Response(serializer.data, status=200)
    
class CreateUserAndTutorView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        user_serializer = RegisterSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()
            user.set_password(request.data['password'])
            user.save()
            tutor_profile_serializer = TutorProfileSerializer(data=request.data)

            if tutor_profile_serializer.is_valid():
                tutor_profile_serializer.save(user=user)
                return Response({"message": "Tutor registred succesfully"}, status=200)
            else:
                user.delete()
                return Response({"errors": tutor_profile_serializer.errors}, status=400)
        else:
            return Response({"errors": user_serializer.errors}, status=400)


class AvailableSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.data)
        try:
            tutor_profile = TutorProfile.objects.get(user=request.user)
        except TutorProfile.DoesNotExist:
            return Response({"error": "Tutor profile not found"}, status=status.HTTP_404_NOT_FOUND)

        # Pass the request in the context to the serializer
        serializer = AvailableSessionSerializer(data=request.data, tutor=tutor_profile, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        try:
            tutor_profile = TutorProfile.objects.get(user=request.user)
        except TutorProfile.DoesNotExist:
            return Response({'error': "Tutor profile not found"}, status=status.HTTP_404_NOT_FOUND)

        # Retrieve only available sessions for this tutor
        available_sessions = AvailableSession.objects.filter(tutor=request.user)
        serializer = AvailableSessionSerializer(available_sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request, pk=None):
        print(request.data)
        try:
            # First get the session instance
            session = AvailableSession.objects.get(id=pk, tutor=request.user)
            
            # Get the tutor profile
            try:
                tutor_profile = TutorProfile.objects.get(user=request.user)
            except TutorProfile.DoesNotExist:
                return Response({"error": "Tutor profile not found"}, status=status.HTTP_404_NOT_FOUND)
            
            # Update the session with new data
            serializer = AvailableSessionSerializer(
                session,
                data=request.data,
                tutor=tutor_profile,
                context={'request': request},
                partial=True  # This allows partial updates
            )
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except AvailableSession.DoesNotExist:
            return Response(
                {"error": "Session not found or you don't have permission to update it."},
                status=status.HTTP_404_NOT_FOUND
            )
    
    def delete(self, request, pk=None):
        try:
            session = AvailableSession.objects.get(id=pk, tutor=request.user)
            session.delete()
            return Response({"message": "Session deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except AvailableSession.DoesNotExist:
            return Response({"error": "Session not found or you don’t have permission to delete it."}, status=status.HTTP_404_NOT_FOUND)




class AllAvailableSessionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Retrieve all available sessions
        available_sessions = AvailableSession.objects.filter(is_booked=False)  # Ensure only unbooked sessions are returned
        serializer = AvailableSessionSerializer(available_sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProfileDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user.profile
    
    
    
class BookSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        available_session_id = request.data.get("available_session")
        
        try:
            # Check if the session is available and not booked
            available_session = AvailableSession.objects.get(id=available_session_id, is_booked=False)
        except AvailableSession.DoesNotExist:
            return Response({"error": "This session is already booked or does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Create a new booked session using the serializer
        serializer = BookedSessionSerializer(data={
            "available_session": available_session.id  # Pass only available_session id
        }, context={'request': request})
        
        if serializer.is_valid():
            # Save the serializer with the logged-in user as the student
            booked_session = serializer.save(student=request.user)
            # Mark session as booked
            available_session.is_booked = True
            available_session.save()
            # Return the serialized data
            return Response(BookedSessionSerializer(booked_session).data, status=status.HTTP_201_CREATED)
        
        # If serializer is invalid, print errors to debug and return them
        print("Serializer errors:", serializer.errors)  # Logs the errors to the console
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StudentBookedSessionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get all sessions booked by the logged-in student
            booked_sessions = BookedSession.objects.filter(
                student=request.user
            ).select_related(
                'available_session__tutor'
            ).order_by('-booking_date')
            
            serializer = StudentBookedSessionSerializer(booked_sessions, many=True)
            
            # Group sessions by status
            sessions_by_status = {
                'pending': [],
                'confirmed': [],
                'completed': []
            }
            
            for session in serializer.data:
                session_status = session['status'].lower()  # Ensuring lowercase for consistency
                sessions_by_status[session_status].append(session)
            
            return Response({
                'all_sessions': serializer.data,
                'grouped_sessions': sessions_by_status
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Error fetching student booked sessions: {str(e)}")
            return Response(
                {"error": "Failed to fetch booked sessions."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def delete(self, request, pk=None):
        try:
            # Get the specific booked session by ID and check if it belongs to the student
            booked_session = get_object_or_404(BookedSession, id=pk, student=request.user)
            
            # Update the associated AvailableSession's is_booked field to False
            available_session = booked_session.available_session
            available_session.is_booked = False
            available_session.save()

            # Delete the BookedSession instance
            booked_session.delete()
            return Response({"message": "Session cancelled successfully."}, status=status.HTTP_204_NO_CONTENT)
        
        except BookedSession.DoesNotExist:
            return Response({"error": "Session not found."}, status=status.HTTP_404_NOT_FOUND)

class TutorBookedSessionsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            # Get all booked sessions for the current tutor
            booked_sessions = BookedSession.objects.filter(
                available_session__tutor=request.user
            ).select_related(
                'student',
                'available_session'
            ).prefetch_related('feedback')  # Prefetch related feedbacks for completed sessions
            
            serializer = TutorBookedSessionSerializer(booked_sessions, many=True)
            
            # Group sessions by status
            sessions_by_status = {
                'pending': [],
                'confirmed': [],
                'completed': []
            }
            
            for session in serializer.data:
                session_status = session['status'].lower()
                sessions_by_status[session_status].append(session)
            
            return Response({
                'all_sessions': serializer.data,
                'grouped_sessions': sessions_by_status
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"Error fetching tutor booked sessions: {str(e)}")
            return Response(
                {"error": "Failed to fetch booked sessions."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ConfirmBookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk=None):
        try:
            booking = BookedSession.objects.get(id=pk, available_session__tutor=request.user)
        except BookedSession.DoesNotExist:
            return Response({"error":"Booking not found."}, status=status.HTTP_400_BAD_REQUEST)
        
        booking.status = 'Confirmed'
        booking.save()
        return Response({"message":"Session confirmed successfully."}, status=status.HTTP_200_OK)

    def put(self, request, pk=None):
        print(request.data)
        try:
            session = BookedSession.objects.get(
                available_session_id=pk,
                available_session__tutor=request.user,
                status='Pending' 
            )
            session.status = "Confirmed"
            session.save()
            serializer = BookedSessionSerializer(session)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except BookedSession.DoesNotExist:
            return Response({"error": "Session does not exist or is not booked."}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk=None):
        try:
            booking = BookedSession.objects.get(
                id=pk, 
                available_session__tutor=request.user,
                status='Pending'
            )
            booking.status = 'Confirmed'
            booking.save()
            return Response(
                {"message": "Session confirmed successfully."},
                status=status.HTTP_200_OK
            )
        except BookedSession.DoesNotExist:
            return Response(
                {"error": "Booking not found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

class CompleteSessionView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk=None):
        try:
            # Get the session, ensuring it belongs to the tutor and is confirmed
            session = BookedSession.objects.get(
                id=pk,
                available_session__tutor=request.user,
                status='Confirmed'  # Only confirmed sessions can be completed
            )
            
            session.status = 'Completed'
            session.completed_at = timezone.now()  # If you want to track completion time
            session.save()
            
            return Response(
                {"message": "Session marked as completed successfully."},
                status=status.HTTP_200_OK
            )
            
        except BookedSession.DoesNotExist:
            return Response(
                {"error": "Session not found or not confirmed."}, 
                status=status.HTTP_404_NOT_FOUND
            )



class AddSessionLinkView(APIView):
    #permission_classes = [IsAuthenticated]

    def patch(self, request, session_id):
        print(request.data)
        # Retrieve the booked session or return a 404 if not found
        booked_session = get_object_or_404(BookedSession, id=session_id)

        # Verify that the requesting user is the tutor of this session
        if booked_session.available_session.tutor != request.user:
            return Response(
                {"error": "You are not authorized to add a link to this session."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if the session is confirmed before allowing the link to be added
        if booked_session.status != 'Confirmed':
            return Response(
                {"error": "Session link can only be added to confirmed sessions."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Deserialize and validate the input data
        serializer = SessionLinkSerializer(booked_session, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  # Update only the session_link field
            return Response(
                {"message": "Session link added successfully.", "session_link": serializer.data['session_link']},
                status=status.HTTP_200_OK
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubmitFeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id):
        try:
            # Get the booked session
            booked_session = BookedSession.objects.get(id=session_id, student=request.user)
            
            # Verify session is completed
            if booked_session.status != 'Completed':
                return Response(
                    {"error": f"Cannot submit feedback. Session status is {booked_session.status}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Retrieve TutorProfile directly
            tutor_profile = TutorProfile.objects.get(user=booked_session.available_session.tutor)
            
            # Check for existing feedback
            existing_feedback = Feedback.objects.filter(booked_session=booked_session).first()
            if existing_feedback:
                return Response(
                    {"error": "Feedback already exists for this session"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Serialize the feedback
            serializer = FeedbackSerializer(data=request.data)
            
            # Validate and save with the booked_session
            if serializer.is_valid():
                feedback = serializer.save(
                    booked_session=booked_session,
                    student=request.user,
                    tutor_profile=tutor_profile
                )
                
                tutor_profile.update_rating()  # Ensure this method exists on TutorProfile
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                print(f"Validation errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except BookedSession.DoesNotExist:
            return Response(
                {"error": "Session not found or unauthorized"},
                status=status.HTTP_404_NOT_FOUND
            )
        except TutorProfile.DoesNotExist:
            return Response(
                {"error": "Tutor profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def get(self, request, session_id):
        try:
            # Retrieve the booked session
            booked_session = BookedSession.objects.get(id=session_id, student=request.user)
            print(booked_session)

            # Check if feedback exists for this session
            feedback = Feedback.objects.filter(booked_session=booked_session).first()
            print(feedback)
            if not feedback:
                return Response(
                    {"error": "No feedback available for this session"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Serialize and return the feedback
            serializer = FeedbackSerializer(feedback)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except BookedSession.DoesNotExist:
            return Response(
                {"error": "Session not found or unauthorized"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )




class TutorFeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Get the tutor profile of the logged-in user
            tutor_profile = TutorProfile.objects.get(user=request.user)
            
            # Retrieve all feedback related to this tutor
            feedbacks = Feedback.objects.filter(tutor_profile=tutor_profile)
            serializer = FeedbackSerializer(feedbacks, many=True)
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except TutorProfile.DoesNotExist:
            return Response(
                {"error": "Tutor profile not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TutorSearchView(APIView):
    def get(self, request):
        query = request.query_params.get('q', '').strip()
        
        # Filter tutors by matching name, subject, or location
        tutors = TutorProfile.objects.filter(
            Q(user__first_name__icontains=query) |
            Q(user__last_name__icontains=query) |
            Q(subjects__icontains=query) |
            Q(location__icontains=query)
        )

        serializer = TutorProfileSerializer(tutors, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



def home(requests):
    return render(requests, "users/home.html")