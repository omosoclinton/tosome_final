from django.contrib import admin
from .models import User, TutorProfile, Profile, Session, AvailableSession, BookedSession
# Register your models here.

admin.site.register(TutorProfile)
admin.site.register(User)
admin.site.register(Profile)
admin.site.register(Session)
admin.site.register(AvailableSession)
admin.site.register(BookedSession)