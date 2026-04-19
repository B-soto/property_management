from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('project', ProjectViewSet, basename='project')
router.register('projectmanager', ProjectManagerViewSet, basename='projectmanager')

def nested_views(viewset_class, list_actions=None, detail_actions=None):
    list_actions = list_actions or {'get': 'list', 'post': 'create'}
    detail_actions = detail_actions or {'get': 'retrieve', 'put': 'update', 'patch': 'update', 'delete': 'destroy'}
    return (
        viewset_class.as_view(list_actions),
        viewset_class.as_view(detail_actions),
    )

legal_list, legal_detail = nested_views(LegalDocumentViewSet)
tenant_list, tenant_detail = nested_views(TenantViewSet)
applicant_list, applicant_detail = nested_views(ApplicantViewSet, detail_actions={'put': 'update', 'patch': 'update', 'delete': 'destroy'})
appliance_list, appliance_detail = nested_views(ApplianceViewSet)
maintenance_list, maintenance_detail = nested_views(MaintenanceRequestViewSet)

urlpatterns = [
    path('api/register/', register_user, name='register_user'),
    # Legal Documents
    path('project/<int:property_id>/legal-documents/', legal_list, name='legal-documents-list'),
    path('project/<int:property_id>/legal-documents/<int:pk>/', legal_detail, name='legal-document-detail'),
    # Tenants
    path('project/<int:property_id>/tenants/', tenant_list, name='tenants-list'),
    path('project/<int:property_id>/tenants/<int:pk>/', tenant_detail, name='tenant-detail'),
    # Applicants
    path('project/<int:property_id>/applicants/', applicant_list, name='applicants-list'),
    path('project/<int:property_id>/applicants/<int:pk>/', applicant_detail, name='applicant-detail'),
    # Appliances
    path('project/<int:property_id>/appliances/', appliance_list, name='appliances-list'),
    path('project/<int:property_id>/appliances/<int:pk>/', appliance_detail, name='appliance-detail'),
    # Maintenance
    path('project/<int:property_id>/maintenance/', maintenance_list, name='maintenance-list'),
    path('project/<int:property_id>/maintenance/<int:pk>/', maintenance_detail, name='maintenance-detail'),
] + router.urls


# urlpatterns = [
#     path('', home )
# ]