from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt 
from users.models import User
import json
from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.urls import reverse
import requests
from rest_framework_simplejwt.tokens import AccessToken, TokenError


# Create views here.
@csrf_exempt 
def signup(request): 
    if request.method == 'POST':
        name = request.POST['name']
        username = request.POST['username']
        description = request.POST['description']
        phone = request.POST['phone']
        email = request.POST['email']
        password = request.POST['password']
        user = User(name=name, email=email, username=username, phone=phone, description=description)
        # Set the user's password and save the user object
        user.set_password(password)
        user.save()
        if user is not None:
            user = authenticate(request, username=email, password=password)
            login(request, user)
            # Now, let's obtain the token pair
            token_url = request.build_absolute_uri(reverse('token_obtain_pair'))  # Assuming you named your token endpoint 'token_obtain_pair'
            data = {'username': email, 'password': password}  # You might need to adjust this based on your actual payload
            response = requests.post(token_url, data=data)
            return JsonResponse({"message": "registeration successfull", "token_data": response.json()}, safe=False)
        else:
            return JsonResponse({"message": "something went wrong", "status": False })

    return JsonResponse('Hello, world!')


@csrf_exempt
def loginApi(request):
    email = request.POST.get('email')
    password = request.POST.get('password')

    if email is None or password is None:
        return JsonResponse({"message": "Email and password are required.", "status": False}, status=400)

    user = authenticate(request, username=email, password=password)

    if user is None:
        return JsonResponse({"message": "Invalid email or password.", "status": False}, status=401)

    login(request, user)
    request.session.user = user
    # Now, let's obtain the token pair
    token_url = request.build_absolute_uri(reverse('token_obtain_pair'))  # Assuming you named your token endpoint 'token_obtain_pair'
    data = {'username': email, 'password': password}  # You might need to adjust this based on your actual payload
    response = requests.post(token_url, data=data)

    if response.status_code == 200:
        return JsonResponse({"message": "Login successful", "token_data": response.json()}, status=200)
    else:
        return JsonResponse({"message": "Failed to obtain tokens", "status": False}, status=500)



@csrf_exempt
@api_view(['GET'])
def userProfile(request, id):
    authorization_header = request.headers.get('Authorization')
    if authorization_header is None:
        return Response({'error': 'Authorization header is missing'}, status=status.HTTP_401_UNAUTHORIZED)
    try:
        token = authorization_header.split()[1]  # Get the token part (without 'Bearer ')
    except IndexError:
        return Response({'error': 'Invalid authorization header'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        access_token = AccessToken(token)
        # Token is valid, perform actions accordingly
        return Response({'message': 'Authenticated successfully'})
    except TokenError:
        return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)


