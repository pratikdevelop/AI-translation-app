
from django.urls import path, include
from rest_framework.authtoken import views
from rest_framework_simplejwt import views as jwt_views 

from . import views
urlpatterns = [
    path('signup',  views.signup),
    path('login',  views.loginApi),
    path("userProfile/<id>/", views.userProfile),
    path('token', jwt_views.TokenObtainPairView.as_view(), name ='token_obtain_pair'), 
]
