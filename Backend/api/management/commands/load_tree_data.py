from django.core.management.base import BaseCommand
from api.models import County, TreePlanting
import pandas as pd
from datetime import datetime
import os

class Command(BaseCommand):
    help = 'Load tree planting data from Jazamiti Excel file'

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
        
        self.stdout.write(f'Loading tree data from: {excel_path}')
        
        # Read the Excel file
        try:
            df = pd.read_excel(excel_path)
            self.stdout.write(f'Found {len(df)} rows in Excel file')
            self.stdout.write(f'Columns: {list(df.columns)}')
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Failed to read Excel file: {str(e)}')
            )
            return
        
        # Clear existing tree data
        self.stdout.write('Clearing existing tree data...')
        TreePlanting.objects.all().delete()
        
        # Process and import data
        self.import_data(df)
        
        self.stdout.write(
            self.style.SUCCESS('Successfully imported tree planting data!')
        )
    
    def import_data(self, df):
        """Import tree planting data from DataFrame"""
        tree_records = []
        skipped = 0
        
        for idx, row in df.iterrows():
            try:
                # Get county name
                county_name = str(row.get('county', '')).strip()
                if not county_name or pd.isna(county_name):
                    skipped += 1
                    continue
                
                # Find or create county
                county = County.objects.filter(name__iexact=county_name).first()
                if not county:
                    # Try partial match
                    county = County.objects.filter(name__icontains=county_name).first()
                
                if not county:
                    self.stdout.write(
                        self.style.WARNING(f'County not found: {county_name}, skipping row {idx}')
                    )
                    skipped += 1
                    continue
                
                # Parse date
                date_val = row.get('dateOfPlanting')
                if pd.notna(date_val):
                    if isinstance(date_val, str):
                        try:
                            date_val = datetime.strptime(date_val.strip(), '%Y-%m-%d').date()
                        except:
                            try:
                                date_val = datetime.strptime(date_val.strip(), '%d/%m/%Y').date()
                            except:
                                try:
                                    date_val = datetime.strptime(date_val.strip(), '%m/%d/%Y').date()
                                except:
                                    date_val = None
                    elif isinstance(date_val, datetime):
                        date_val = date_val.date()
                    elif isinstance(date_val, pd.Timestamp):
                        date_val = date_val.date()
                else:
                    date_val = None
                
                # Get numeric values safely
                def get_int(val, default=0):
                    try:
                        if pd.notna(val):
                            return int(float(val))
                    except:
                        pass
                    return default
                
                def get_float(val, default=0.0):
                    try:
                        if pd.notna(val):
                            return float(val)
                    except:
                        pass
                    return default
                
                seedlings = get_int(row.get('seedlingPlanted'))
                survived = get_int(row.get('survived'))
                hectares = get_float(row.get('hectares'))
                lat = get_float(row.get('latitude'))
                lng = get_float(row.get('longitude'))
                
                tree_records.append(TreePlanting(
                    county=county,
                    organisation=str(row.get('Organisation', ''))[:200],
                    date_of_planting=date_val,
                    location=str(row.get('treePlantingLocation', ''))[:300],
                    seedlings_planted=seedlings,
                    species_planted=str(row.get('speciesPlanted', ''))[:200],
                    latitude=lat if lat != 0 else None,
                    longitude=lng if lng != 0 else None,
                    survived=survived,
                    is_verified=bool(row.get('isVerified', False)),
                    verified_by=str(row.get('verifiedBy', ''))[:100],
                    hectares=hectares
                ))
                
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(f'Error processing row {idx}: {str(e)}')
                )
                skipped += 1
                continue
        
        # Bulk create
        if tree_records:
            try:
                TreePlanting.objects.bulk_create(tree_records, batch_size=1000)
                self.stdout.write(
                    self.style.SUCCESS(f'Created {len(tree_records)} tree planting records')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creating tree records: {str(e)}')
                )
        
        if skipped > 0:
            self.stdout.write(f'Skipped {skipped} rows')
        
        # Show summary by county
        self.show_summary()
    
    def show_summary(self):
        """Show summary of imported data"""
        self.stdout.write('\nTree Planting Summary by County:')
        for county in County.objects.all()[:10]:
            total = county.tree_plantings.count()
            if total > 0:
                seedlings = sum(t.seedlings_planted for t in county.tree_plantings.all())
                survived = sum(t.survived for t in county.tree_plantings.all())
                hectares = sum(t.hectares for t in county.tree_plantings.all())
                survival_rate = (survived / seedlings * 100) if seedlings > 0 else 0
                self.stdout.write(f'  {county.name}: {total} records, {seedlings} seedlings, {survival_rate:.1f}% survival, {hectares:.1f} ha')
