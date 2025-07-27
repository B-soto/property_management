from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('project', ProjectViewSet, basename='project')
router.register('projectmanager', ProjectManagerViewSet, basename='projectmanager')

# Combine manual paths with router URLs - registration is a single action, not CRUD
urlpatterns = [
    path('api/register/', register_user, name='register_user'),
] + router.urls


# urlpatterns = [
#     path('', home )
# ]