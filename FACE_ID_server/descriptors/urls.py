from django.urls import path
from .views import save_descriptor, list_descriptors

urlpatterns = [
    path('save_descriptor/', save_descriptor),
    path('list_descriptors/', list_descriptors)
]