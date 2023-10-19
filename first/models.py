from django.db import models
from django.conf import settings

# Create your models here.
class UploadImage(models.Model):
    img=models.ImageField(upload_to=settings.BASE_DIR,default=None)
    name=models.CharField(max_length=50,default=None)