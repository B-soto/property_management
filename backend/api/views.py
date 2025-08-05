# Added imports for user registration functionality
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .models import *

from .serializers import *
from rest_framework.response import Response
# Create your views here.

# def home(request):
#     return HttpResponse("This is the homepage")

class ProjectManagerViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = ProjectManager.objects.all()
    serializer_class = ProjectManagerSerialzier

    def list(self, request):
        queryset = ProjectManager.objects.all() # self.queryset dont call self heer becasue we'll never reload the newly craeted things
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)



class ProjectViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Project.objects.all()
    serializer_class = ProjectSerialzier

    def list(self, request):
        # FURY MODE: Show user's own projects + unassigned projects (backward compatibility)! 🔥
        from django.db.models import Q
        queryset = Project.objects.filter(
            Q(owner=request.user) | Q(owner__isnull=True)
        )
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # FURY MODE: Auto-assign current user as owner! 💪
            serializer.save(owner=request.user)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=404)

    def retrieve(self, request, pk=None):
        # FURY MODE: Get user's own projects + unassigned projects! 🔥
        try:
            from django.db.models import Q
            project = Project.objects.get(
                Q(pk=pk) & (Q(owner=request.user) | Q(owner__isnull=True))
            )
            serializer = self.serializer_class(project)
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found or access denied'}, status=404)

    def update(self, request, pk=None):
        # FURY MODE: Update user's own projects + unassigned projects! 💪
        try:
            from django.db.models import Q
            project = Project.objects.get(
                Q(pk=pk) & (Q(owner=request.user) | Q(owner__isnull=True))
            )
            serializer = self.serializer_class(project, data=request.data)
            if serializer.is_valid():
                # If project has no owner, assign current user when updating
                if not project.owner:
                    serializer.save(owner=request.user)
                else:
                    serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=404)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found or access denied'}, status=404)

    def destroy(self, request, pk=None):
        # FURY MODE: Delete user's own projects + unassigned projects! 🔥
        try:
            from django.db.models import Q
            project = Project.objects.get(
                Q(pk=pk) & (Q(owner=request.user) | Q(owner__isnull=True))
            )
            project.delete()
            return Response(status=204)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found or access denied'}, status=404)


# User Registration Endpoint - Simple function view for user creation
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    try:
        data = request.data
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        return Response({
            'message': 'User created successfully',
            'user_id': user.id,
            'username': user.username
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LegalDocumentViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LegalDocumentSerializer
    
    def list(self, request, property_id=None):
        # FURY MODE: Show documents for user's own properties + unassigned properties! 🔥
        try:
            from django.db.models import Q
            property_obj = Project.objects.get(
                Q(id=property_id) & (Q(owner=request.user) | Q(owner__isnull=True))
            )
            documents = LegalDocument.objects.filter(property=property_obj, is_active=True)
            serializer = self.serializer_class(documents, many=True)
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response({'error': 'Property not found or access denied'}, status=404)
    
    def create(self, request, property_id=None):
        # FURY MODE: Upload documents to user's own properties + unassigned properties! 💪
        try:
            from django.db.models import Q
            property_obj = Project.objects.get(
                Q(id=property_id) & (Q(owner=request.user) | Q(owner__isnull=True))
            )
            # If property has no owner, assign current user
            if not property_obj.owner:
                property_obj.owner = request.user
                property_obj.save()
            
            serializer = self.serializer_class(data=request.data)
            if serializer.is_valid():
                serializer.save(property=property_obj, uploaded_by=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=400)
        except Project.DoesNotExist:
            return Response({'error': 'Property not found or access denied'}, status=404)
    
    def retrieve(self, request, pk=None, property_id=None):
        # FURY MODE: Retrieve documents from user's properties + unassigned properties! 🔥
        try:
            from django.db.models import Q
            property_obj = Project.objects.get(
                Q(id=property_id) & (Q(owner=request.user) | Q(owner__isnull=True))
            )
            document = LegalDocument.objects.get(pk=pk, property=property_obj)
            serializer = self.serializer_class(document)
            return Response(serializer.data)
        except (Project.DoesNotExist, LegalDocument.DoesNotExist):
            return Response({'error': 'Document not found or access denied'}, status=404)
    
    def update(self, request, pk=None, property_id=None):
        # FURY MODE: Update documents from user's properties + unassigned properties! 💪
        try:
            from django.db.models import Q
            property_obj = Project.objects.get(
                Q(id=property_id) & (Q(owner=request.user) | Q(owner__isnull=True))
            )
            document = LegalDocument.objects.get(pk=pk, property=property_obj)
            serializer = self.serializer_class(document, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except (Project.DoesNotExist, LegalDocument.DoesNotExist):
            return Response({'error': 'Document not found or access denied'}, status=404)
    
    def destroy(self, request, pk=None, property_id=None):
        # FURY MODE: Soft delete documents from user's properties + unassigned properties! 🔥
        try:
            from django.db.models import Q
            property_obj = Project.objects.get(
                Q(id=property_id) & (Q(owner=request.user) | Q(owner__isnull=True))
            )
            document = LegalDocument.objects.get(pk=pk, property=property_obj)
            document.is_active = False
            document.save()
            return Response({'message': 'Document deleted successfully'}, status=204)
        except (Project.DoesNotExist, LegalDocument.DoesNotExist):
            return Response({'error': 'Document not found or access denied'}, status=404)
