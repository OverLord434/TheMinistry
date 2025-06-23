from django.urls import path
from .views import ManualParseAPIView, AutoCheckAPIView

urlpatterns = [
    path('parse/', ManualParseAPIView.as_view(), name='manual_parse_api'),
    path('auto-check/', AutoCheckAPIView.as_view()),
]