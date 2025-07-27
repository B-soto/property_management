from django.urls import path
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('project', ProjectViewSet, basename='project')
router.register('projectmanager', ProjectManagerViewSet, basename='projectmanager')

urlpatterns = router.urls


# urlpatterns = [
#     path('', home )
# ]