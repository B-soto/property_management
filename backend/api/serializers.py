from rest_framework import serializers
from .models import *


class ProjectSerialzier(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'name', 'projectmanager', 'start_date', 'end_date', 'comments', 'status')


class ProjectManagerSerialzier(serializers.ModelSerializer):
    class Meta:
        model = ProjectManager
        fields = ('id', 'name')

    