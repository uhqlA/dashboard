from django.core.management.base import BaseCommand
from api.models import County, TreePlanting
import pandas as pd
from datetime import datetime, date
import os

class Command(BaseCommand):
    help = 'Import tree planting data from Jazamiti Excel file'

    def handle(self, *args, **options):
        excel_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))),
            'Jazamitiproject.xlsx'
        )
        
        if not os.path.exists(excel_path):
            self.stdout.write(self.style.ERROR(f'File not found: {excel_path}'))
            return
        
        self.stdout.write(f'Loading from: {excel_path}')
        
        try:
            df = pd.read_excel(excel_path)
            self.stdout.write(f'Found {len(df)} rows')
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Failed to read: {str(e)}'))
            return
        
        # Clear existing
        TreePlanting.objects.all().delete()
        
        records = []
        for idx, row in df.iterrows():
            try:
                county_name = str(row.get('county', '')).strip()
                if not county_name or pd.isna(county_name):
                    continue
                
                county = County.objects.filter(name__iexact=county_name).first()
                if not county:
                    continue
                
                # Parse date
                date_val = None
                raw_date = row.get('dateOfPlanting')
                if pd.notna(raw_date):
                    if isinstance(raw_date, pd.Timestamp):
                        date_val = raw_date.date()
                    elif isinstance(raw_date, datetime):
                        date_val = raw_date.date()
                    elif isinstance(raw_date, date):
                        date_val = raw_date
                
                # Get numbers safely
                def safe_int(val):
                    try:
                        if pd.notna(val):
                            return int(float(val))
                    except:
                        pass
                    return 0
                
                def safe_float(val):
                    try:
                        if pd.notna(val):
                            return float(val)
                    except:
                        pass
                    return 0.0
                
                records.append(TreePlanting(
                    county=county,
                    organisation=str(row.get('Organisation', ''))[:200] if pd.notna(row.get('Organisation')) else '',
                    date_of_planting=date_val,
                    location=str(row.get('treePlantingLocation', ''))[:300] if pd.notna(row.get('treePlantingLocation')) else '',
                    seedlings_planted=safe_int(row.get('seedlingPlanted')),
                    species_planted=str(row.get('speciesPlanted', ''))[:200] if pd.notna(row.get('speciesPlanted')) else '',
                    latitude=safe_float(row.get('latitude')) if safe_float(row.get('latitude')) != 0 else None,
                    longitude=safe_float(row.get('longitude')) if safe_float(row.get('longitude')) != 0 else None,
                    survived=safe_int(row.get('survived')),
                    is_verified=bool(row.get('isVerified', False)),
                    verified_by=str(row.get('verifiedBy', ''))[:100] if pd.notna(row.get('verifiedBy')) else '',
                    hectares=safe_float(row.get('hectares'))
                ))
                
            except Exception as e:
                continue
        
        # Bulk create
        if records:
            TreePlanting.objects.bulk_create(records, batch_size=1000)
            self.stdout.write(self.style.SUCCESS(f'Created {len(records)} tree records'))
            
            # Show summary
            self.stdout.write('\nTop counties by seedlings:')
            for county in County.objects.all():
                total_seedlings = sum(t.seedlings_planted for t in county.tree_plantings.all())
                if total_seedlings > 0:
                    self.stdout.write(f'  {county.name}: {total_seedlings:,} seedlings')
