from celery import shared_task
import requests
import logging
logger = logging.getLogger(__name__)

@shared_task
def auto_check_task():
    try:
        response = requests.post(
            'http://82.202.128.59/api/auto-check/',
            json={},
            headers={'Content-Type': 'application/json'}
        )
        response.raise_for_status()
    except requests.RequestException as e:
        logger.error(f"Ошибка запроса в auto_check_task: {str(e)}")