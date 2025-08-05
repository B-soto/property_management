from django.db import models
from django.contrib.auth.models import User

# Foriegn key tutorial w/ react / django
# https://www.youtube.com/watch?v=kSIG2fwFBc8&list=PLmEKHA8iFrmBCo1Guf3xbM1af5p5Ja-fy&index=12
class ProjectManager(models.Model):
    name = models.CharField(unique=True, max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    

class Project(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects', null=True, blank=True)
    projectmanager = models.ForeignKey(ProjectManager, on_delete=models.CASCADE, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    comments = models.CharField(max_length=500, blank=True, null=True)
    status = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class LegalDocument(models.Model):
    DOCUMENT_TYPES = [
        ('lease', 'Lease Agreement'),
        ('deed', 'Property Deed'),
        ('insurance', 'Insurance Policy'),
        ('inspection', 'Inspection Report'),
        ('permit', 'Building Permit'),
        ('contract', 'Service Contract'),
        ('other', 'Other Document'),
    ]
    
    property = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='legal_documents')
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to='legal_documents/')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    upload_date = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-upload_date']
    
    def __str__(self):
        return f"{self.title} - {self.property.name}"
