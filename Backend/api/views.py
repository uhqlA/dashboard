from django.http import JsonResponse
from django.db import connection
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def test_connection(request):
    """Test database connection"""
    try:
        with connection.cursor() as cursor:
            cursor.execute('SELECT NOW()')
            result = cursor.fetchone()
        
        return Response({
            'message': 'Database connected successfully!',
            'timestamp': result[0] if result else None
        })
    except Exception as error:
        return Response({
            'error': 'Failed to connect to database',
            'details': str(error)
        }, status=500)


@api_view(['GET'])
def get_tables(request):
    """Get list of database tables"""
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                ORDER BY table_name
            """)
            tables = [row[0] for row in cursor.fetchall()]
        
        return Response({'tables': tables})
    except Exception as error:
        return Response({
            'error': 'Failed to fetch tables',
            'details': str(error)
        }, status=500)
