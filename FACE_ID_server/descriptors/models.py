from django.db import models


class Descriptor(models.Model):
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    descriptor = models.CharField(max_length=4000)