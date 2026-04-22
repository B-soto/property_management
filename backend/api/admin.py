from django.contrib import admin
from . models import *

admin.site.register(Project)
admin.site.register(ProjectManager)
admin.site.register(Tenant)
admin.site.register(Applicant)
admin.site.register(Appliance)
admin.site.register(MaintenanceRequest)
admin.site.register(LegalDocument)
admin.site.register(UserProfile)

