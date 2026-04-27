from django.core.management.base import BaseCommand
from api.models import County, ClimateData
import pandas as pd
from datetime import datetime
import os

class Command(BaseCommand):
    help = 'Load real climate data from Jazamiti Excel file'

    def handle(self, *args, **options):
        excel_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
            'Jazamitiproject.xlsx'
        )
        
        if not os.path.exists(excel_path):
            self.stdout.write(
                self.style.ERROR(f'Excel file not found at: {excel_path}')
            )
            return
        
        self.stdout.write(f'Loading data from: {excel_path}')
        
        # Read the Excel file
        try:
            df = pd.read_excel(excel_path)
            self.stdout.write(f'Found {len(df)} rows in Excel file')
            self.stdout.write(f'Columns: {list(df.columns)}')
            self.stdout.write(f'\nFirst 5 rows:\n{df.head()}')
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Failed to read Excel file: {str(e)}')
            )
            return
        
        # Clear existing fake data
        self.stdout.write('Clearing existing data...')
        ClimateData.objects.all().delete()
        County.objects.all().delete()
        
        # Process and import data
        self.import_data(df)
        
        self.stdout.write(
            self.style.SUCCESS('Successfully imported Jazamiti data!')
        )
    
    def import_data(self, df):
        """Import data from DataFrame - adapts to actual column structure"""
        counties_created = {}
        climate_data_list = []
        seen_climate_keys = set()  # Track (county_id, date) to avoid duplicates
        used_codes = set()  # Track used county codes
        
        # Detect column names (case-insensitive matching)
        columns = {col.lower().strip(): col for col in df.columns}
        
        for idx, row in df.iterrows():
            try:
                # Try to extract county name
                county_col = None
                for key in ['county', 'region', 'location', 'area', 'station']:
                    if key in columns:
                        county_col = columns[key]
                        break
                
                if county_col:
                    county_name = str(row[county_col]).strip()
                else:
                    county_name = f'Location_{idx}'
                
                # Create or get county with unique code
                if county_name not in counties_created:
                    base_code = county_name[:3].upper() if len(county_name) >= 3 else county_name.upper()
                    county_code = base_code
                    counter = 1
                    while county_code in used_codes:
                        county_code = f"{base_code}{counter}"
                        counter += 1
                    used_codes.add(county_code)
                    
                    try:
                        county = County.objects.create(name=county_name, code=county_code)
                        counties_created[county_name] = county
                        self.stdout.write(f'Created county: {county_name} (code: {county_code})')
                    except Exception as e:
                        # If creation failed, try to get existing
                        county = County.objects.filter(name=county_name).first()
                        if not county:
                            continue
                        counties_created[county_name] = county
                else:
                    county = counties_created[county_name]
                
                # Extract date (try various formats)
                date_val = None
                for key in ['date', 'day', 'time', 'timestamp']:
                    if key in columns:
                        date_val = row[columns[key]]
                        break
                
                if date_val and pd.notna(date_val):
                    if isinstance(date_val, str):
                        try:
                            date_val = datetime.strptime(date_val, '%Y-%m-%d').date()
                        except:
                            try:
                                date_val = datetime.strptime(date_val, '%d/%m/%Y').date()
                            except:
                                date_val = datetime.now().date()
                    elif isinstance(date_val, datetime):
                        date_val = date_val.date()
                    else:
                        date_val = datetime.now().date()
                else:
                    date_val = datetime.now().date()
                
                # Check for duplicate climate data
                climate_key = (county.id if county else None, date_val)
                if climate_key in seen_climate_keys:
                    continue  # Skip duplicate
                seen_climate_keys.add(climate_key)
                
                # Extract climate values with flexible column matching
                def get_value(keywords, default=0.0):
                    for key in keywords:
                        if key in columns:
                            val = row[columns[key]]
                            if pd.notna(val):
                                try:
                                    return float(val)
                                except:
                                    return default
                    return default
                
                temperature = get_value(['temperature', 'temp', 'tmax', 'max_temp', 'temp_max'], 25.0)
                humidity = get_value(['humidity', 'rh', 'relative_humidity', 'humid'], 60.0)
                rainfall = get_value(['rainfall', 'rain', 'precipitation', 'precip', 'mm'], 0.0)
                wind_speed = get_value(['wind', 'wind_speed', 'windspeed', 'ws'], 10.0)
                
                climate_data_list.append(ClimateData(
                    county=county,
                    date=date_val,
                    temperature=round(temperature, 1),
                    humidity=round(humidity, 1),
                    rainfall=round(rainfall, 1),
                    wind_speed=round(wind_speed, 1)
                ))
                
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(f'Error processing row {idx}: {str(e)}')
                )
                continue
        
        # Bulk create climate data with ignore_conflicts
        if climate_data_list:
            try:
                ClimateData.objects.bulk_create(climate_data_list, batch_size=1000, ignore_conflicts=True)
                self.stdout.write(
                    self.style.SUCCESS(f'Created {len(climate_data_list)} climate data records')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creating climate data: {str(e)}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Created {len(counties_created)} counties')
        )
