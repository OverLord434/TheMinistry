from django.contrib import admin
from .models import Organization, OrganizationStats, CheckHistory

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'url', 'email')  
    search_fields = ('name',)  
    list_filter = ('name',) 
    
    class Meta:
        verbose_name = 'Организация'
        verbose_name_plural = 'Организации'

@admin.register(OrganizationStats)
class OrganizationStatsAdmin(admin.ModelAdmin):
    list_display = ('organization', 'total_found_attrs', 'total_missing_attrs', 'last_checked_at')
    search_fields = ('organization__name',)  
    list_filter = ('last_checked_at',) 
    
    class Meta:
        verbose_name = 'Статистика организации'
        verbose_name_plural = 'Статистики организаций'

@admin.register(CheckHistory)
class CheckHistoryAdmin(admin.ModelAdmin):
    list_display = ('organization', 'total_found_attrs', 'total_missing_attrs', 'previous_checked_at')
    search_fields = ('organization__name',)  
    list_filter = ('previous_checked_at',)  
    
    class Meta:
        verbose_name = 'История проверки'
        verbose_name_plural = 'Истории проверок'