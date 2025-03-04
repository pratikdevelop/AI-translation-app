from django.urls import path
from rest_framework_simplejwt import views as jwt_views
from . import views

urlpatterns = [
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('userProfile/<int:id>/', views.UserProfileView.as_view(), name='user_profile'),
    path('password-reset/', views.PasswordResetView.as_view(), name='password_reset'),
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', views.TokenRefreshView.as_view(), name='token_refresh'),
]

# Let me know if you’d like me to add more routes or customize further! 🚀
