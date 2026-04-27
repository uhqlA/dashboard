from django.contrib import admin
from .models import County, ClimateData

@admin.register(County)
class CountyAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'created_at')
    search_fields = ('name', 'code')
    ordering = ('name',)

@admin.register(ClimateData)
class ClimateDataAdmin(admin.ModelAdmin):
    list_display = ('county', 'date', 'temperature', 'humidity', 'rainfall', 'wind_speed')
    list_filter = ('county', 'date')
    search_fields = ('county__name',)
    ordering = ('-date', '-county')
    date_hierarchy = 'date'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('county')
