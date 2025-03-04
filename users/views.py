from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError
from rest_framework import status
from django.urls import reverse
from django.core.mail import send_mail
import requests
from .models import User

# Signup View (Class-Based)
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        name = request.data.get('name')
        username = request.data.get('username')
        description = request.data.get('description', '')
        phone = request.data.get('phone', '')
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role', 'job_seeker')

        if not all([name, email, password]):
            return Response({"error": "Name, email, and password are required"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(
            email=email,
            name=name,
            password=password,
            username=username,
            description=description,
            phone=phone,
            role=role
        )
        
        user.save()
        return Response({"message": "Registration successful"}, status=status.HTTP_201_CREATED)

    def get(self, request):
        return render(request, 'auth/signup.html')


# Login View (Class-Based)
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({"message": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, email=email, password=password)
        if not user:
            return Response({"message": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        login(request, user)
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful",
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh)
        }, status=status.HTTP_200_OK)

    def get(self, request):
        return render(request, 'auth/login.html')


# Logout View
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)


# Token Refresh View
class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return Response({"access_token": access_token}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)


# Password Reset View
class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            new_password = User.objects.make_random_password()
            user.set_password(new_password)
            user.save()

            send_mail(
                'Password Reset',
                f'Your new password is: {new_password}',
                'no-reply@jobportal.com',
                [email]
            )
            return Response({"message": "Password reset email sent"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request):
        return render(request, 'auth/password_reset.html')


# User Profile View
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        return render(request, 'auth/profile.html', {
            "username": user.username,
            "email": user.email,
            "name": user.name,
            "phone": user.phone,
            "description": user.description,
            "role": user.role,
            "linkedin_url": user.linkedin_url,
            "portfolio_url": user.portfolio_url,
            "company_name": user.company_name,
            "company_website": user.company_website,
            "company_description": user.company_description,
            "status": user.status,
            "profile_image": user.profile_image.url if user.profile_image else None,
            "created_at": user.created_at,
            "updated_at": user.updated_at,
        })

# Let me know if you’d like me to refine anything else! 🚀
