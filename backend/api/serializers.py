from rest_framework import serializers
from .models import *


class ProjectSerialzier(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'name', 'owner', 'projectmanager', 'start_date', 'end_date', 'comments', 'status')


class ProjectManagerSerialzier(serializers.ModelSerializer):
    class Meta:
        model = ProjectManager
        fields = ('id', 'name')


class LegalDocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.username', read_only=True)
    file_size = serializers.SerializerMethodField()
    
    class Meta:
        model = LegalDocument
        fields = ('id', 'document_type', 'title', 'description', 'file', 'uploaded_by', 'uploaded_by_name', 
                 'upload_date', 'expiry_date', 'is_active', 'file_size')
        read_only_fields = ('uploaded_by', 'upload_date')
    
    def get_file_size(self, obj):
        if obj.file:
            return obj.file.size
        return None