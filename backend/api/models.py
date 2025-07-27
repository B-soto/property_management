from django.db import models

# Foriegn key tutorial w/ react / django
# https://www.youtube.com/watch?v=kSIG2fwFBc8&list=PLmEKHA8iFrmBCo1Guf3xbM1af5p5Ja-fy&index=12
class ProjectManager(models.Model):
    name = models.CharField(unique=True, max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    name = models.CharField(unique=True, max_length=100)
    projectmanager = models.ForeignKey(ProjectManager, on_delete=models.CASCADE, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    comments = models.CharField(max_length=500, blank=True, null=True)
    status = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
