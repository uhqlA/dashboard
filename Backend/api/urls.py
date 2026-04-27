from django.urls import path
from . import views

urlpatterns = [
    path('test-connection/', views.test_connection, name='test_connection'),
    path('tables/', views.tables, name='tables'),
    path('counties/', views.counties, name='counties'),
    path('climate-data/', views.climate_data, name='climate_data'),
    path('climate-comparison/', views.climate_comparison, name='climate_comparison'),
    path('tree-data/', views.tree_data, name='tree_data'),
    path('tree-species/', views.tree_species_stats, name='tree_species_stats'),
]
