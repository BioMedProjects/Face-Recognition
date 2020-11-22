from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import DescriptorSerializer


@api_view(['POST'])
def save_descriptor(request):
    if request.method == 'POST':
        serializer = DescriptorSerializer()
        serializer.create(validated_data=request.data)
    return Response({"oj byczku": "poszło"})


@api_view(['GET'])
def list_descriptors(request):
    if request.method == 'GET':
        serializer = DescriptorSerializer()
        data = serializer.list_all()
    return Response(data)
