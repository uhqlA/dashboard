from django.urls import path
from . import views

urlpatterns = [
    path('test-connection/', views.test_connection, name='test-connection'),
    path('tables/', views.get_tables, name='get-tables'),
]
