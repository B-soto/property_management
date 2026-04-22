from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .models import *
from .serializers import *
from rest_framework.response import Response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        try:
            token['role'] = user.profile.role
        except UserProfile.DoesNotExist:
            token['role'] = 'landlord'
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
# Create your views here.

# def home(request):
#     return HttpResponse("This is the homepage")

class ProjectManagerViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = ProjectManager.objects.all()
    serializer_class = ProjectManagerSerializer

    def list(self, request):
        queryset = ProjectManager.objects.all() # self.queryset dont call self heer becasue we'll never reload the newly craeted things
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)



class ProjectViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

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
        UserProfile.objects.create(user=user, role='landlord')

        return Response({
            'message': 'User created successfully',
            'user_id': user.id,
            'username': user.username
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


def get_property_or_403(request, property_id):
    from django.db.models import Q
    try:
        return Project.objects.get(Q(id=property_id) & (Q(owner=request.user) | Q(owner__isnull=True))), None
    except Project.DoesNotExist:
        return None, Response({'error': 'Property not found or access denied'}, status=404)


class TenantViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TenantSerializer

    def list(self, request, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        is_current = request.query_params.get('is_current')
        qs = Tenant.objects.filter(property=prop)
        if is_current is not None:
            qs = qs.filter(is_current=is_current.lower() == 'true')
        return Response(self.serializer_class(qs, many=True).data)

    def create(self, request, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(property=prop)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=400)

    def retrieve(self, request, pk=None, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        try:
            return Response(self.serializer_class(Tenant.objects.get(pk=pk, property=prop)).data)
        except Tenant.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

    def update(self, request, pk=None, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        try:
            tenant = Tenant.objects.get(pk=pk, property=prop)
            serializer = self.serializer_class(tenant, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except Tenant.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

    def destroy(self, request, pk=None, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        try:
            tenant = Tenant.objects.get(pk=pk, property=prop)
            # Delete the linked User account if one exists (cascades to UserProfile)
            profile = tenant.user_account.first()
            if profile:
                profile.user.delete()
            tenant.delete()
            return Response(status=204)
        except Tenant.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)


class ApplicantViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ApplicantSerializer

    def list(self, request, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        return Response(self.serializer_class(Applicant.objects.filter(property=prop), many=True).data)

    def create(self, request, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(property=prop)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=400)

    def update(self, request, pk=None, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        try:
            applicant = Applicant.objects.get(pk=pk, property=prop)
            serializer = self.serializer_class(applicant, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except Applicant.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

    def destroy(self, request, pk=None, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        try:
            Applicant.objects.get(pk=pk, property=prop).delete()
            return Response(status=204)
        except Applicant.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)


class ApplianceViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ApplianceSerializer

    def list(self, request, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        return Response(self.serializer_class(Appliance.objects.filter(property=prop), many=True).data)

    def create(self, request, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(property=prop)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=400)

    def update(self, request, pk=None, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        try:
            appliance = Appliance.objects.get(pk=pk, property=prop)
            serializer = self.serializer_class(appliance, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except Appliance.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

    def destroy(self, request, pk=None, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        try:
            Appliance.objects.get(pk=pk, property=prop).delete()
            return Response(status=204)
        except Appliance.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)


class MaintenanceRequestViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MaintenanceRequestSerializer

    def list(self, request, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        return Response(self.serializer_class(MaintenanceRequest.objects.filter(property=prop), many=True).data)

    def create(self, request, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(property=prop)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=400)

    def retrieve(self, request, pk=None, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        try:
            return Response(self.serializer_class(MaintenanceRequest.objects.get(pk=pk, property=prop)).data)
        except MaintenanceRequest.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

    def update(self, request, pk=None, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        try:
            req = MaintenanceRequest.objects.get(pk=pk, property=prop)
            serializer = self.serializer_class(req, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except MaintenanceRequest.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)

    def destroy(self, request, pk=None, property_id=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err
        try:
            MaintenanceRequest.objects.get(pk=pk, property=prop).delete()
            return Response(status=204)
        except MaintenanceRequest.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)


class PropertyAnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, property_id=None, pk=None):
        prop, err = get_property_or_403(request, property_id)
        if err: return err

        from django.db.models import Sum, Count, Q

        tenants = Tenant.objects.filter(property=prop)
        maintenance = MaintenanceRequest.objects.filter(property=prop)

        return Response({
            'current_tenants': tenants.filter(is_current=True).count(),
            'total_tenants': tenants.count(),
            'total_monthly_rent': tenants.filter(is_current=True).aggregate(
                total=Sum('rent_amount')
            )['total'] or 0,
            'open_maintenance_requests': maintenance.filter(
                status__in=['open', 'in_progress']
            ).count(),
            'total_maintenance_cost': maintenance.filter(status='completed').aggregate(
                total=Sum('cost')
            )['total'] or 0,
            'pending_applicants': Applicant.objects.filter(property=prop, status='pending').count(),
            'appliances_needing_repair': Appliance.objects.filter(property=prop, status='needs_repair').count(),
            'active_documents': LegalDocument.objects.filter(property=prop, is_active=True).count(),
        })


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


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_tenant_login(request, property_id, tenant_id):
    prop, err = get_property_or_403(request, property_id)
    if err: return err

    try:
        tenant = Tenant.objects.get(pk=tenant_id, property=prop)
    except Tenant.DoesNotExist:
        return Response({'error': 'Tenant not found'}, status=404)

    if tenant.user_account.exists():
        return Response({'error': 'This tenant already has a login'}, status=400)

    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=400)

    user = User.objects.create_user(username=username, password=password)
    UserProfile.objects.create(user=user, role='tenant', tenant=tenant)

    return Response({'message': f'Login created for {tenant.name}'}, status=201)


@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def tenant_maintenance(request):
    try:
        profile = request.user.profile
        if profile.role != 'tenant':
            return Response({'error': 'Access denied'}, status=403)
        if not profile.tenant:
            return Response({'error': 'No property linked to your account'}, status=400)
        prop = profile.tenant.property
    except UserProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=404)

    if request.method == 'GET':
        qs = MaintenanceRequest.objects.filter(property=prop, submitted_by=request.user).order_by('-created_date')
        return Response(TenantMaintenanceSerializer(qs, many=True).data)

    serializer = TenantMaintenanceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(property=prop, status='open', submitted_by=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def tenant_dashboard(request):
    try:
        profile = request.user.profile
        if profile.role != 'tenant':
            return Response({'error': 'Access denied'}, status=403)
        tenant = profile.tenant
        return Response({
            'username': request.user.username,
            'role': profile.role,
            'property': tenant.property.name if tenant else None,
            'rent_amount': str(tenant.rent_amount) if tenant and tenant.rent_amount else None,
            'lease_start': str(tenant.lease_start) if tenant else None,
            'lease_end': str(tenant.lease_end) if tenant else None,
        })
    except UserProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=404)
