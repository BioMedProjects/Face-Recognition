from rest_framework import serializers
from .models import Descriptor


class DescriptorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Descriptor
        fields = [
            'name',
            'surname',
            'descriptor'
        ]

    def create(self, validated_data):
        descriptor_object = Descriptor(
            name=validated_data['name'],
            surname=validated_data['surname'],
            descriptor=validated_data['descriptor']
        )
        descriptor_object.save()
        return validated_data

    def list_all(self):
        data = [{
            "name": obj.name,
            "surname": obj.surname,
            "descriptor": obj.descriptor
        } for obj in Descriptor.objects.all()]
        return data
