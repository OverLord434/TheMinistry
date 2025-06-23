from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import JSONParser
from .serializers import ManualParseSerializer, AutoCheckSerializer
from .parser_runner import run_parser
from .models import Organization, OrganizationStats, CheckHistory
from .utils import send_word_report
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.utils import timezone

def update_check_history(organization, found, missing):
    stats, _ = OrganizationStats.objects.get_or_create(organization=organization)

    if stats.last_checked_at:
        CheckHistory.objects.update_or_create(
            organization=organization,
            defaults={
                'total_found_attrs': stats.total_found_attrs,
                'total_missing_attrs': stats.total_missing_attrs,
                'previous_checked_at': stats.last_checked_at
            }
        )

    stats.total_found_attrs = found
    stats.total_missing_attrs = missing
    stats.last_checked_at = timezone.now()
    stats.save()

class ManualParseAPIView(APIView):
    parser_classes = [JSONParser]

    def post(self, request):
        serializer = ManualParseSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        url = serializer.validated_data['url']
        send_to_email = serializer.validated_data.get('send_to_email', False)
        subject = serializer.validated_data.get('email_subject', 'Отчёт проверки')
        body = serializer.validated_data.get('email_body', 'Во вложении находится Excel-отчёт')

        try:
            org = Organization.objects.get(url__iexact=url)
            parsed_data = run_parser(org.name, org.url)

            if parsed_data['stats']['Основной сайт']['status'] == 'unavailable':
                raise Exception("Основной сайт недоступен")

            total_found = sum(s.get('found_attrs', 0) for s in parsed_data['stats'].values())
            total_missing = sum(s.get('missing_attrs', 0) for s in parsed_data['stats'].values())

            update_check_history(org, total_found, total_missing)

            if send_to_email and org.email:
                send_word_report(
                    to_email=org.email,
                    org_name=org.name,
                    results=parsed_data['excel_data'],
                    subject=subject,
                    body=body
                )

            return Response({
                'organization': org.name,
                'sections': [{
                    'name': name,
                    'status': '✅ Доступен' if s['status'] == 'available' else '❌ Недоступен',
                    'found_attrs': s['found_attrs'],
                    'missing_attrs': s['missing_attrs']
                } for name, s in parsed_data['stats'].items()]
            }, status=status.HTTP_200_OK)

        except Organization.DoesNotExist:
            return Response({'detail': 'Организация не найдена'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                'status': 'error',
                'organization': org.name if 'org' in locals() else None,
                'reason': str(e),
                'type': 'Основной сайт недоступен' if 'Основной сайт' in str(e) else 'Ошибка проверки'
            }, status=status.HTTP_400_BAD_REQUEST)
            
class AutoCheckAPIView(APIView):
    def post(self, request):
        serializer = AutoCheckSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        organizations = Organization.objects.all()
        total = organizations.count()
        checked = 0
        failed = []
        invalid = 0
        channel_layer = get_channel_layer()

        for org in organizations:
            if not org.url:
                invalid += 1
                continue

            try:
                parsed_data = run_parser(org.name, org.url)

                if parsed_data['stats']['Основной сайт']['status'] == 'unavailable':
                    raise Exception("Основной сайт недоступен")

                total_found = sum(s.get('found_attrs', 0) for s in parsed_data['stats'].values())
                total_missing = sum(s.get('missing_attrs', 0) for s in parsed_data['stats'].values())

                update_check_history(org, total_found, total_missing)

                if org.email and total_missing > 0:
                    send_word_report(
                        to_email=org.email,
                        org_name=org.name,
                        results=parsed_data['excel_data'],
                        subject=serializer.validated_data.get('email_subject', 'Отчёт проверки'),
                        body=serializer.validated_data.get('email_body', 'Во вложении находится Excel-отчёт')
                    )

                checked += 1
                async_to_sync(channel_layer.group_send)(
                    "progress",
                    {
                        "type": "send_progress",
                        "message": {
                            "checked": checked,
                            "total": total,
                            "organization": org.name
                        }
                    }
                )

            except Exception as e:
                failed.append({
                    "organization": org.name,
                    "url": org.url,
                    "reason": str(e),
                    "type": "Основной сайт недоступен" if "Основной сайт" in str(e) else "Другая ошибка"
                })

        return Response({
            "status": "done",
            "total_organizations": total,
            "successfully_checked": checked,
            "invalid_urls": invalid,
            "failed_checks": failed
        }, status=status.HTTP_200_OK)