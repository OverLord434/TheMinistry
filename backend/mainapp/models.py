from django.db import models

class Organization(models.Model):
    name = models.CharField(max_length=512, db_index=True, verbose_name="Название")
    url = models.URLField(unique=False, db_index=True, verbose_name="URL сайта")
    email = models.EmailField(null=True, verbose_name="Email")
    
    class Meta:
        verbose_name = 'Организация'
        verbose_name_plural = 'Организации'
    
    def __str__(self):
        return self.name

class OrganizationStats(models.Model):
    organization = models.OneToOneField(Organization, on_delete=models.CASCADE, related_name='latest_stats', verbose_name="Организация")
    total_found_attrs = models.PositiveIntegerField(default=0, verbose_name="Найдено атрибутов")
    total_missing_attrs = models.PositiveIntegerField(default=0, verbose_name="Отсутствует атрибутов")
    last_checked_at = models.DateTimeField(null=True, blank=True, verbose_name="Дата последней проверки")
    
    class Meta:
        verbose_name = 'Статистика организации'
        verbose_name_plural = 'Статистики организаций'
    
    def __str__(self):
        return f"Статистика {self.organization.name}"

class CheckHistory(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='history', verbose_name="Организация")
    total_found_attrs = models.PositiveIntegerField(verbose_name="Найдено атрибутов")
    total_missing_attrs = models.PositiveIntegerField(verbose_name="Отсутствует атрибутов")
    previous_checked_at = models.DateTimeField(verbose_name="Дата предыдущей проверки")
    
    class Meta:
        verbose_name = 'История проверки'
        verbose_name_plural = 'Истории проверок'
        ordering = ['-previous_checked_at']  
    
    def __str__(self):
        return f"Проверка {self.organization.name} от {self.previous_checked_at.strftime('%d.%m.%Y %H:%M')}"