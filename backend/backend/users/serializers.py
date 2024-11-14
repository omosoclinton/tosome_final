from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from django.contrib.auth.password_validation import validate_password
from .models import TutorProfile, AvailableSession, Profile, BookedSession




class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = get_user_model()
        fields = ('first_name','last_name','username', 'email', 'password', 'password2', 'user_type')
      
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match"})
        return attrs
    
    def create(self, validated_data):
        print('created')
        print(f'This is self validated data: {self.validated_data}')
        user = get_user_model()(
            last_name = self.validated_data['last_name'],
            first_name = self.validated_data['first_name'],
            username = self.validated_data['username'],
            email = self.validated_data['email'],
            user_type = self.validated_data['user_type'],
        )
        user.set_password(validated_data['password'])
        user.save()
        # Create a token for new user
        Token.objects.create(user=user)

        return user
    
class TutorProfileSerializer(serializers.ModelSerializer):
       
    class Meta:
        model = TutorProfile
        fields = ['subjects', 'qualifications', 'experience', 'rating', 'status']
        
        
        



class AvailableSessionSerializer(serializers.ModelSerializer):
    subject = serializers.ChoiceField(choices=[])

    class Meta:
        model = AvailableSession
        fields = ['id', 'subject', 'date', 'is_booked']

    def __init__(self, *args, **kwargs):
        tutor = kwargs.pop('tutor', None)
        super().__init__(*args, **kwargs)
        # Populate choices for the subject field based on the tutor profile
        if tutor:
            self.fields['subject'].choices = [(subj, subj) for subj in tutor.subjects.split(", ")]

    def create(self, validated_data):
        validated_data['tutor'] = self.context['request'].user
        return super().create(validated_data)


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Profile
        fields = [
            'id', 'username', 'email', 'image', 'about',
            'phone_number', 'linked_in', 'github'
        ]
        read_only_fields = ['id']
        
class BookedSessionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    student_email = serializers.EmailField(source='student.email', read_only=True)

    class Meta:
        model = BookedSession
        fields = ['id', 'available_session', 'student_name', 'student_email', 'booking_date', 'status']
        read_only_fields = ['booking_date', 'student']
        
class TutorBookedSessionSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    subject = serializers.CharField(source='available_session.subject')
    date = serializers.DateTimeField(source='available_session.date')
    booking_date = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = BookedSession
        fields = ['id', 'student_name', 'subject', 'date', 'booking_date', 'status', 'session_link']
        
    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}"
    
    


class StudentBookedSessionSerializer(serializers.ModelSerializer):
    tutor_name = serializers.SerializerMethodField()
    subject = serializers.CharField(source='available_session.subject')
    date = serializers.DateTimeField(source='available_session.date')
    booking_date = serializers.DateTimeField(read_only=True)

    class Meta:
        model = BookedSession
        fields = [
            'id',
            'tutor_name',
            'subject',
            'date',
            'status',
            'booking_date',
            'session_link'  # Include the session_link field
        ]

    def get_tutor_name(self, obj):
        return f"{obj.available_session.tutor.first_name} {obj.available_session.tutor.last_name}"



class SessionLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookedSession
        fields = ['session_link']

    def validate_session_link(self, value):
        if not value:
            raise serializers.ValidationError("Session link cannot be empty.")
        # Basic URL validation
        if not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("Please provide a valid URL starting with http:// or https://")
        return value

    def validate(self, data):
        instance = self.instance
        if instance and instance.status != 'Confirmed':
            raise serializers.ValidationError(
                "Session link can only be added to confirmed sessions."
            )
        return data