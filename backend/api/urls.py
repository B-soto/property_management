from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

# Main router for projects and project managers
router = DefaultRouter()
router.register('project', ProjectViewSet, basename='project')
router.register('projectmanager', ProjectManagerViewSet, basename='projectmanager')

# FURY MODE: Manual nested URLs for legal documents! 💪
legal_docs_viewset = LegalDocumentViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

legal_doc_detail_viewset = LegalDocumentViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'update',
    'delete': 'destroy'
})

# Combine manual paths with router URLs
urlpatterns = [
    path('api/register/', register_user, name='register_user'),
    path('project/<int:property_id>/legal-documents/', legal_docs_viewset, name='legal-documents-list'),
    path('project/<int:property_id>/legal-documents/<int:pk>/', legal_doc_detail_viewset, name='legal-document-detail'),
] + router.urls


# urlpatterns = [
#     path('', home )
# ]