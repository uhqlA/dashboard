from django.core.management.base import BaseCommand
from django.utils.dateparse import parse_date
from api.models import County, ClimateData
import random
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Load sample climate data for selected Kenyan counties'

    def handle(self, *args, **options):
        # Clear existing data
        ClimateData.objects.all().delete()
        County.objects.all().delete()
        
        # Create counties
        counties_data = [
            ('Nairobi', 'NBI'),
            ('Kisumu', 'KSM'),
            ('Mombasa', 'MBA'),
            ('Kajiado', 'KJD'),
            ('Turkana', 'TRK'),
            ('Kiambu', 'KMB')
        ]
        
        counties = {}
        for name, code in counties_data:
            county = County.objects.create(name=name, code=code)
            counties[name] = county
            self.stdout.write(f'Created county: {name}')
        
        # Generate sample climate data for the last 30 days
        base_date = datetime.now().date()
        climate_data = []
        
        for county_name, county in counties.items():
            for days_ago in range(30):
                date = base_date - timedelta(days=days_ago)
                
                # Generate realistic climate data based on county characteristics
                if county_name == 'Nairobi':
                    temp = random.uniform(18, 25)  # Cool highland
                    humidity = random.uniform(45, 75)
                    rainfall = random.uniform(0, 15) if random.random() < 0.3 else 0
                    wind_speed = random.uniform(5, 20)
                elif county_name == 'Mombasa':
                    temp = random.uniform(24, 32)  # Hot coastal
                    humidity = random.uniform(70, 90)
                    rainfall = random.uniform(0, 25) if random.random() < 0.4 else 0
                    wind_speed = random.uniform(10, 30)
                elif county_name == 'Kisumu':
                    temp = random.uniform(20, 28)  # Warm lakeside
                    humidity = random.uniform(60, 85)
                    rainfall = random.uniform(0, 20) if random.random() < 0.35 else 0
                    wind_speed = random.uniform(8, 25)
                elif county_name == 'Turkana':
                    temp = random.uniform(28, 38)  # Very hot arid
                    humidity = random.uniform(20, 45)
                    rainfall = random.uniform(0, 5) if random.random() < 0.1 else 0
                    wind_speed = random.uniform(15, 35)
                elif county_name == 'Kajiado':
                    temp = random.uniform(22, 30)  # Semi-arid
                    humidity = random.uniform(35, 65)
                    rainfall = random.uniform(0, 10) if random.random() < 0.2 else 0
                    wind_speed = random.uniform(10, 28)
                elif county_name == 'Kiambu':
                    temp = random.uniform(16, 23)  # Cool highland
                    humidity = random.uniform(50, 80)
                    rainfall = random.uniform(0, 18) if random.random() < 0.32 else 0
                    wind_speed = random.uniform(6, 22)
                
                climate_data.append(ClimateData(
                    county=county,
                    date=date,
                    temperature=round(temp, 1),
                    humidity=round(humidity, 1),
                    rainfall=round(rainfall, 1),
                    wind_speed=round(wind_speed, 1)
                ))
        
        # Bulk create all climate data
        ClimateData.objects.bulk_create(climate_data)
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully loaded {len(climate_data)} climate data points for {len(counties)} counties')
        )
        
        # Show sample data
        self.stdout.write('\nSample data for Nairobi (last 5 days):')
        nairobi_data = ClimateData.objects.filter(county=counties['Nairobi'])[:5]
        for data in nairobi_data:
            self.stdout.write(
                f'  {data.date}: {data.temperature}°C, {data.humidity}% humidity, '
                f'{data.rainfall}mm rain, {data.wind_speed}km/h wind'
            )
