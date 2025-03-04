from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.urls import reverse
import requests

# Signup View (Class-Based)
class IndexView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return render(request, 'index.html')
