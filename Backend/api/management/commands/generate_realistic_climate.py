from django.core.management.base import BaseCommand
from api.models import County, ClimateData
import random
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Generate realistic climate data for Kenyan counties based on geography'

    # Realistic climate profiles for Kenyan counties based on geography
    COUNTY_CLIMATE_PROFILES = {
        # Coastal - Hot and humid
        'Mombasa': {'temp_base': 28, 'temp_var': 3, 'humidity_base': 80, 'rain_base': 80, 'wind_base': 18},
        'Kwale': {'temp_base': 27, 'temp_var': 3, 'humidity_base': 78, 'rain_base': 85, 'wind_base': 15},
        'Kilifi': {'temp_base': 27, 'temp_var': 3, 'humidity_base': 77, 'rain_base': 75, 'wind_base': 16},
        'Lamu': {'temp_base': 28, 'temp_var': 2, 'humidity_base': 79, 'rain_base': 65, 'wind_base': 20},
        'Tana River': {'temp_base': 29, 'temp_var': 4, 'humidity_base': 70, 'rain_base': 55, 'wind_base': 12},
        
        # Nairobi area - Cool highlands
        'Nairobi': {'temp_base': 20, 'temp_var': 4, 'humidity_base': 60, 'rain_base': 70, 'wind_base': 14},
        'Kiambu': {'temp_base': 19, 'temp_var': 4, 'humidity_base': 65, 'rain_base': 85, 'wind_base': 12},
        'Kajiado': {'temp_base': 24, 'temp_var': 5, 'humidity_base': 50, 'rain_base': 45, 'wind_base': 16},
        'Machakos': {'temp_base': 23, 'temp_var': 4, 'humidity_base': 55, 'rain_base': 60, 'wind_base': 14},
        'Makueni': {'temp_base': 25, 'temp_var': 4, 'humidity_base': 52, 'rain_base': 50, 'wind_base': 15},
        
        # Central Highlands - Cool and wet
        'Nyeri': {'temp_base': 18, 'temp_var': 4, 'humidity_base': 70, 'rain_base': 110, 'wind_base': 10},
        'Kirinyaga': {'temp_base': 19, 'temp_var': 3, 'humidity_base': 72, 'rain_base': 105, 'wind_base': 11},
        'Muranga': {'temp_base': 19, 'temp_var': 3, 'humidity_base': 73, 'rain_base': 100, 'wind_base': 10},
        'Nyandarua': {'temp_base': 16, 'temp_var': 5, 'humidity_base': 75, 'rain_base': 95, 'wind_base': 14},
        'Embu': {'temp_base': 21, 'temp_var': 4, 'humidity_base': 68, 'rain_base': 90, 'wind_base': 12},
        'Tharaka-Nithi': {'temp_base': 23, 'temp_var': 4, 'humidity_base': 62, 'rain_base': 75, 'wind_base': 13},
        
        # Rift Valley - Varied
        'Nakuru': {'temp_base': 20, 'temp_var': 5, 'humidity_base': 58, 'rain_base': 80, 'wind_base': 16},
        'Kericho': {'temp_base': 19, 'temp_var': 3, 'humidity_base': 75, 'rain_base': 160, 'wind_base': 12},
        'Bomet': {'temp_base': 19, 'temp_var': 3, 'humidity_base': 74, 'rain_base': 155, 'wind_base': 11},
        'Uasin Gishu': {'temp_base': 18, 'temp_var': 5, 'humidity_base': 65, 'rain_base': 120, 'wind_base': 14},
        'Trans Nzoia': {'temp_base': 20, 'temp_var': 4, 'humidity_base': 68, 'rain_base': 140, 'wind_base': 13},
        'Nandi': {'temp_base': 19, 'temp_var': 4, 'humidity_base': 70, 'rain_base': 145, 'wind_base': 12},
        'Baringo': {'temp_base': 26, 'temp_var': 5, 'humidity_base': 45, 'rain_base': 65, 'wind_base': 14},
        'Turkana': {'temp_base': 32, 'temp_var': 6, 'humidity_base': 35, 'rain_base': 25, 'wind_base': 18},
        'West Pokot': {'temp_base': 26, 'temp_var': 5, 'humidity_base': 55, 'rain_base': 80, 'wind_base': 13},
        'Samburu': {'temp_base': 28, 'temp_var': 6, 'humidity_base': 40, 'rain_base': 45, 'wind_base': 15},
        'Elgeyo-Marakwet': {'temp_base': 21, 'temp_var': 4, 'humidity_base': 65, 'rain_base': 115, 'wind_base': 12},
        'Laikipia': {'temp_base': 22, 'temp_var': 5, 'humidity_base': 50, 'rain_base': 60, 'wind_base': 16},
        'Narok': {'temp_base': 20, 'temp_var': 5, 'humidity_base': 60, 'rain_base': 85, 'wind_base': 18},
        'Kakamega': {'temp_base': 23, 'temp_var': 3, 'humidity_base': 75, 'rain_base': 180, 'wind_base': 10},
        'Vihiga': {'temp_base': 22, 'temp_var': 3, 'humidity_base': 78, 'rain_base': 190, 'wind_base': 9},
        'Bungoma': {'temp_base': 24, 'temp_var': 3, 'humidity_base': 72, 'rain_base': 165, 'wind_base': 11},
        'Busia': {'temp_base': 25, 'temp_var': 3, 'humidity_base': 70, 'rain_base': 140, 'wind_base': 12},
        
        # Lake Victoria Basin - Warm and humid
        'Kisumu': {'temp_base': 26, 'temp_var': 3, 'humidity_base': 72, 'rain_base': 130, 'wind_base': 14},
        'Siaya': {'temp_base': 25, 'temp_var': 3, 'humidity_base': 70, 'rain_base': 125, 'wind_base': 13},
        'Homa Bay': {'temp_base': 26, 'temp_var': 3, 'humidity_base': 68, 'rain_base': 110, 'wind_base': 14},
        'Migori': {'temp_base': 25, 'temp_var': 3, 'humidity_base': 69, 'rain_base': 120, 'wind_base': 13},
        'Kisii': {'temp_base': 21, 'temp_var': 3, 'humidity_base': 76, 'rain_base': 155, 'wind_base': 10},
        'Nyamira': {'temp_base': 20, 'temp_var': 3, 'humidity_base': 78, 'rain_base': 160, 'wind_base': 9},
        
        # Northern - Arid
        'Marsabit': {'temp_base': 27, 'temp_var': 7, 'humidity_base': 42, 'rain_base': 35, 'wind_base': 20},
        'Isiolo': {'temp_base': 28, 'temp_var': 6, 'humidity_base': 45, 'rain_base': 40, 'wind_base': 18},
        'Meru': {'temp_base': 22, 'temp_var': 4, 'humidity_base': 68, 'rain_base': 100, 'wind_base': 12},
        'Garissa': {'temp_base': 30, 'temp_var': 5, 'humidity_base': 55, 'rain_base': 30, 'wind_base': 16},
        'Wajir': {'temp_base': 29, 'temp_var': 6, 'humidity_base': 48, 'rain_base': 25, 'wind_base': 18},
        'Mandera': {'temp_base': 31, 'temp_var': 5, 'humidity_base': 45, 'rain_base': 20, 'wind_base': 17},
        
        # Default for unknown counties
        'default': {'temp_base': 24, 'temp_var': 5, 'humidity_base': 60, 'rain_base': 70, 'wind_base': 14}
    }

    def get_county_profile(self, county_name):
        """Get climate profile for a county, with fuzzy matching"""
        county_clean = county_name.strip().lower().replace(' county', '').replace(' region', '')
        
        # Direct match
        if county_clean in self.COUNTY_CLIMATE_PROFILES:
            return self.COUNTY_CLIMATE_PROFILES[county_clean]
        
        # Try partial match
        for key, profile in self.COUNTY_CLIMATE_PROFILES.items():
            if key in county_clean or county_clean in key:
                return profile
        
        return self.COUNTY_CLIMATE_PROFILES['default']

    def handle(self, *args, **options):
        self.stdout.write('Generating realistic climate data for all counties...')
        
        # Clear existing climate data
        ClimateData.objects.all().delete()
        self.stdout.write('Cleared existing climate data')
        
        # Get all counties
        counties = County.objects.all()
        self.stdout.write(f'Found {counties.count()} counties')
        
        # Generate 30 days of data for each county
        base_date = datetime.now().date()
        total_records = 0
        
        for county in counties:
            profile = self.get_county_profile(county.name)
            
            # Generate data for last 30 days
            for day in range(30):
                date = base_date - timedelta(days=day)
                
                # Add daily variation
                temp_variation = random.uniform(-profile['temp_var'], profile['temp_var'])
                humidity_variation = random.uniform(-10, 10)
                rain_variation = random.uniform(-20, 30)
                wind_variation = random.uniform(-5, 8)
                
                # Rain is sporadic - only rain some days
                if random.random() < 0.3:  # 30% chance of rain
                    rainfall = max(0, profile['rain_base'] + rain_variation)
                else:
                    rainfall = random.uniform(0, 5)  # Light drizzle or none
                
                ClimateData.objects.create(
                    county=county,
                    date=date,
                    temperature=round(profile['temp_base'] + temp_variation, 1),
                    humidity=round(max(30, min(95, profile['humidity_base'] + humidity_variation)), 1),
                    rainfall=round(rainfall, 1),
                    wind_speed=round(max(5, profile['wind_base'] + wind_variation), 1)
                )
                total_records += 1
            
            self.stdout.write(f'Generated data for {county.name}: Temp {profile["temp_base"]}C, Humidity {profile["humidity_base"]}%')
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {total_records} climate records for {counties.count()} counties!')
        )
        
        # Show sample data
        self.stdout.write('\nSample data:')
        for county in counties[:5]:
            data = ClimateData.objects.filter(county=county).first()
            if data:
                self.stdout.write(f'  {county.name}: {data.temperature}C, {data.humidity}% humidity, {data.rainfall}mm rain')
