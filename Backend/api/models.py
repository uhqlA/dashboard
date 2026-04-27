from django.db import models

class County(models.Model):
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class ClimateData(models.Model):
    county = models.ForeignKey(County, on_delete=models.CASCADE, related_name='climate_data')
    date = models.DateField()
    temperature = models.FloatField(help_text="Temperature in Celsius")
    humidity = models.FloatField(help_text="Humidity percentage")
    rainfall = models.FloatField(help_text="Rainfall in mm")
    wind_speed = models.FloatField(help_text="Wind speed in km/h")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
        unique_together = ['county', 'date']
    
    def __str__(self):
        return f"{self.county.name} - {self.date}"

class TreePlanting(models.Model):
    county = models.ForeignKey(County, on_delete=models.CASCADE, related_name='tree_plantings')
    organisation = models.CharField(max_length=200, blank=True)
    date_of_planting = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=300, blank=True)
    seedlings_planted = models.IntegerField(default=0)
    species_planted = models.CharField(max_length=200, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    survived = models.IntegerField(default=0, help_text="Number of trees that survived")
    is_verified = models.BooleanField(default=False)
    verified_by = models.CharField(max_length=100, blank=True)
    hectares = models.FloatField(default=0, help_text="Area covered in hectares")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date_of_planting']
    
    def __str__(self):
        return f"{self.county.name} - {self.seedlings_planted} seedlings"
