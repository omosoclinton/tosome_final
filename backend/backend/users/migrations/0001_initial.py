# Generated by Django 5.1.3 on 2024-11-13 14:38

import datetime
import django.contrib.auth.models
import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('email', models.EmailField(max_length=254)),
                ('first_name', models.CharField(default='Default first name', max_length=50)),
                ('last_name', models.CharField(default='Default last name', max_length=50)),
                ('username', models.CharField(max_length=50, unique=True)),
                ('user_type', models.CharField(choices=[('student', 'Student'), ('tutor', 'Tutor')], default='student', max_length=10)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to.', related_name='custom_user_set', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='custom_user_permissions_set', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(default='profile_pics/default.jpg', upload_to='profile_pics/')),
                ('about', models.TextField(blank=True, null=True)),
                ('phone_number', models.CharField(default='0700***000', max_length=10)),
                ('linked_in', models.CharField(default='linkedin.com', max_length=255)),
                ('github', models.CharField(default='github.com', max_length=255)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject', models.CharField(max_length=255)),
                ('date', models.DateTimeField(default=datetime.datetime.now)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Confirmed', 'Confirmed'), ('Completed', 'Completed')], default='Pending', max_length=20)),
                ('student', models.ForeignKey(limit_choices_to={'user_type': 'student'}, on_delete=django.db.models.deletion.CASCADE, related_name='student_sessions', to=settings.AUTH_USER_MODEL)),
                ('tutor', models.ForeignKey(limit_choices_to={'user_type': 'tutor'}, on_delete=django.db.models.deletion.CASCADE, related_name='tutor_sessions', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TutorProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subjects', models.CharField(max_length=255)),
                ('qualifications', models.TextField()),
                ('experience', models.TextField()),
                ('rating', models.DecimalField(decimal_places=2, default=0, max_digits=3)),
                ('location', models.CharField(default='Online', max_length=255)),
                ('status', models.CharField(default='Under Review', max_length=20)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
