from django.http import JsonResponse
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import connection
from .models import County, ClimateData, TreePlanting
from django.core.serializers.json import DjangoJSONEncoder
import json

@api_view(['GET'])
def test_connection(request):
    """Test database connection"""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            return Response({
                'status': 'success',
                'message': 'Database connection successful',
                'database': 'PostgreSQL'
            })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'Database connection failed: {str(e)}'
        }, status=500)

@api_view(['GET'])
def tables(request):
    """List all database tables"""
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """)
            tables = [row[0] for row in cursor.fetchall()]
            
            return Response({
                'status': 'success',
                'tables': tables
            })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'Failed to fetch tables: {str(e)}'
        }, status=500)

@api_view(['GET'])
def counties(request):
    """Get all counties"""
    try:
        counties = County.objects.all()
        data = [
            {
                'id': county.id,
                'name': county.name,
                'code': county.code
            }
            for county in counties
        ]
        return Response({
            'status': 'success',
            'counties': data
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'Failed to fetch counties: {str(e)}'
        }, status=500)

@api_view(['GET'])
def climate_data(request):
    """Get climate data with optional filtering"""
    try:
        county_id = request.GET.get('county_id')
        days = int(request.GET.get('days', 30))
        
        queryset = ClimateData.objects.all()
        
        if county_id:
            queryset = queryset.filter(county_id=county_id)
        
        # Filter by date range
        from datetime import datetime, timedelta
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        queryset = queryset.filter(date__gte=start_date, date__lte=end_date)
        
        # Order by date descending
        queryset = queryset.order_by('-date')
        
        data = []
        for record in queryset:
            data.append({
                'id': record.id,
                'county': record.county.name,
                'county_code': record.county.code,
                'date': record.date.strftime('%Y-%m-%d'),
                'temperature': record.temperature,
                'humidity': record.humidity,
                'rainfall': record.rainfall,
                'wind_speed': record.wind_speed
            })
        
        return Response({
            'status': 'success',
            'climate_data': data,
            'total_records': len(data)
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'Failed to fetch climate data: {str(e)}'
        }, status=500)

@api_view(['GET'])
def climate_comparison(request):
    """Compare climate data across multiple counties"""
    try:
        county_names = request.GET.getlist('counties')
        days = int(request.GET.get('days', 7))
        
        if not county_names:
            return Response({
                'status': 'error',
                'message': 'Please provide county names for comparison'
            }, status=400)
        
        counties = County.objects.filter(name__in=county_names)
        if len(counties) != len(county_names):
            return Response({
                'status': 'error',
                'message': 'One or more counties not found'
            }, status=404)
        
        # Get data for the specified period
        from datetime import datetime, timedelta
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        comparison_data = {}
        for county in counties:
            records = ClimateData.objects.filter(
                county=county,
                date__gte=start_date,
                date__lte=end_date
            ).order_by('date')
            
            comparison_data[county.name] = {
                'county_code': county.code,
                'data': [
                    {
                        'date': record.date.strftime('%Y-%m-%d'),
                        'temperature': record.temperature,
                        'humidity': record.humidity,
                        'rainfall': record.rainfall,
                        'wind_speed': record.wind_speed
                    }
                    for record in records
                ],
                'averages': {
                    'temperature': round(sum(r.temperature for r in records) / len(records), 1) if records else 0,
                    'humidity': round(sum(r.humidity for r in records) / len(records), 1) if records else 0,
                    'rainfall': round(sum(r.rainfall for r in records), 1) if records else 0,
                    'wind_speed': round(sum(r.wind_speed for r in records) / len(records), 1) if records else 0
                }
            }
        
        return Response({
            'status': 'success',
            'comparison': comparison_data,
            'period': f'{start_date} to {end_date}',
            'days': days
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'Failed to generate comparison: {str(e)}'
        }, status=500)

@api_view(['GET'])
def tree_data(request):
    """Get tree planting data with optional filtering by county"""
    try:
        county_id = request.GET.get('county_id')
        county_name = request.GET.get('county')
        
        queryset = TreePlanting.objects.all()
        
        if county_id:
            queryset = queryset.filter(county_id=county_id)
        elif county_name:
            queryset = queryset.filter(county__name__icontains=county_name)
        
        # Aggregate stats by county
        county_stats = {}
        for record in queryset:
            name = record.county.name
            if name not in county_stats:
                county_stats[name] = {
                    'county_id': record.county.id,
                    'county_code': record.county.code,
                    'total_seedlings': 0,
                    'total_survived': 0,
                    'total_hectares': 0.0,
                    'planting_count': 0,
                    'organisations': set(),
                    'species': set()
                }
            
            county_stats[name]['total_seedlings'] += record.seedlings_planted
            county_stats[name]['total_survived'] += record.survived
            county_stats[name]['total_hectares'] += record.hectares
            county_stats[name]['planting_count'] += 1
            if record.organisation:
                county_stats[name]['organisations'].add(record.organisation)
            if record.species_planted:
                county_stats[name]['species'].add(record.species_planted)
        
        # Convert sets to lists and calculate survival rate
        for name, stats in county_stats.items():
            stats['organisations'] = list(stats['organisations'])
            stats['species'] = list(stats['species'])
            stats['survival_rate'] = round(
                (stats['total_survived'] / stats['total_seedlings'] * 100), 1
            ) if stats['total_seedlings'] > 0 else 0
            stats['total_hectares'] = round(stats['total_hectares'], 2)
        
        # Individual records
        records = []
        for record in queryset[:100]:  # Limit to 100 records
            records.append({
                'id': record.id,
                'county': record.county.name,
                'county_code': record.county.code,
                'organisation': record.organisation,
                'date_of_planting': record.date_of_planting.strftime('%Y-%m-%d') if record.date_of_planting else None,
                'location': record.location,
                'seedlings_planted': record.seedlings_planted,
                'species_planted': record.species_planted,
                'survived': record.survived,
                'is_verified': record.is_verified,
                'hectares': record.hectares,
                'latitude': record.latitude,
                'longitude': record.longitude
            })
        
        return Response({
            'status': 'success',
            'county_stats': county_stats,
            'records': records,
            'total_records': queryset.count()
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'Failed to fetch tree data: {str(e)}'
        }, status=500)

@api_view(['GET'])
def tree_species_stats(request):
    """Get tree species distribution across all counties"""
    try:
        from django.db.models import Count, Sum
        
        # Get all species counts
        species_data = TreePlanting.objects.values('species_planted').annotate(
            total_seedlings=Sum('seedlings_planted'),
            total_survived=Sum('survived'),
            planting_count=Count('id')
        ).order_by('-total_seedlings')
        
        data = []
        for item in species_data:
            if item['species_planted']:
                data.append({
                    'species': item['species_planted'],
                    'total_seedlings': item['total_seedlings'] or 0,
                    'total_survived': item['total_survived'] or 0,
                    'planting_count': item['planting_count'],
                    'survival_rate': round(
                        (item['total_survived'] / item['total_seedlings'] * 100), 1
                    ) if item['total_seedlings'] else 0
                })
        
        return Response({
            'status': 'success',
            'species_stats': data,
            'total_species': len(data)
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'message': f'Failed to fetch species stats: {str(e)}'
        }, status=500)
