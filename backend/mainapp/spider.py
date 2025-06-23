import asyncio
import aiohttp
import pandas as pd
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from .config import sections, itemprops_requirements, attribute_descriptions

EXCEL_PATH = "НИРО_ред_сайт_Реестр+организаций+28_01_2025+14_04.xlsx"
SHEET_NAME = "Реестр организаций"

class SectionChecker:
    def __init__(self, base_url, session):
        self.base_url = base_url.rstrip('/')
        self.session = session

    async def fetch(self, url):
        try:
            async with self.session.get(url, timeout=10, ssl=False) as response:
                return await response.text() if response.status == 200 else None
        except Exception:
            return None

    async def check_section(self, section):
        section_url = urljoin(self.base_url + '/', section['path'].lstrip('/'))
        content = await self.fetch(section_url)
        status = "available" if content else "unavailable"

        if not content:
            return {
                'url': section_url,
                'section': section['name'],
                'status': status,
                'found_attrs': '',
                'missing_attrs': '',
                'required_attrs': '',
                '_found_count': 0,
                '_missing_count': len(itemprops_requirements.get(section['name'], []))
            }

        soup = BeautifulSoup(content, 'html.parser')
        found_flat = {attr for element in soup.find_all(attrs={"itemprop": True}) for attr in element.get('itemprop', '').split()}
        required = itemprops_requirements.get(section['name'], [])
        found_attrs = [attr for attr in required if attr in found_flat]
        missing_attrs = [attr for attr in required if attr not in found_flat]

        return {
            'url': section_url,
            'section': section['name'],
            'status': status,
            'found_attrs': self.format_attributes(section['name'], found_attrs),
            'missing_attrs': self.format_attributes(section['name'], missing_attrs),
            'required_attrs': self.format_attributes(section['name'], required),
            '_found_count': len(found_attrs),
            '_missing_count': len(missing_attrs)
        }

    @staticmethod
    def format_attributes(section_name, attributes):
        descriptions = attribute_descriptions.get(section_name, {})
        return ", ".join(f"{attr} ({descriptions.get(attr, 'Описание отсутствует')})" for attr in attributes)

class SchoolChecker:
    def __init__(self, name, url):
        self.name = name
        self.url = self.normalize_url(url)
        if not self.url:
            raise ValueError("URL организации не может быть пустым")

    @staticmethod
    def normalize_url(url):
        url = (url or "").strip().lower()
        if not url:
            return None
        if not url.startswith(('http://', 'https://')):
            url = 'http://' + url
        return url.rstrip('/')

    async def check_school(self, session):
        section_checker = SectionChecker(self.url, session)
        main_content = await section_checker.fetch(self.url)
        main_status = "available" if main_content else "unavailable"

        stats = {
            "Основной сайт": {
                "status": main_status,
                "found_attrs": 0,
                "missing_attrs": 0
            }
        }

        excel_data = [{
            'Полное наименование ОО': self.name,
            'Адрес сайта': self.url,
            'Раздел сайта': 'Основной сайт',
            'Статус': "✅ Доступен" if main_status == "available" else "❌ Недоступен",
            'Найдено атрибутов': '',
            'Отсутствуют': '',
            'Все обязательные': ''
        }]

        if main_content:
            tasks = [section_checker.check_section(section) for section in sections]
            sections_results = await asyncio.gather(*tasks)

            for res in sections_results:
                stats[res['section']] = {
                    "status": res['status'],
                    "found_attrs": res['_found_count'],
                    "missing_attrs": res['_missing_count']
                }
                excel_data.append({
                    'Полное наименование ОО': self.name,
                    'Адрес сайта': res['url'],
                    'Раздел сайта': res['section'],
                    'Статус': "✅ Доступен" if res['status'] == "available" else "❌ Недоступен",
                    'Найдено атрибутов': res['found_attrs'],
                    'Отсутствуют': res['missing_attrs'],
                    'Все обязательные': res['required_attrs']
                })

        return {
            "stats": stats,
            "excel_data": excel_data
        }

async def main():
    try:
        df = pd.read_excel(EXCEL_PATH, sheet_name=SHEET_NAME, engine='openpyxl')
        schools = df[['Название', 'Сайт']].dropna().to_dict('records')
    except Exception as e:
        print(f"Ошибка чтения файла: {e}")
        return

    all_results = []

    async with aiohttp.ClientSession(headers={'User-Agent': 'Mozilla/5.0'}) as session:
        for idx, school in enumerate(schools, start=1):
            name, url = school['Название'], school['Сайт']
            print(f"{idx}) Обработка: {name} | {url}")
            
            try:
                checker = SchoolChecker(name, url)
                result = await checker.check_school(session)
                all_results.extend(result["excel_data"])
            except ValueError as e:
                print(f"Пропуск: {name} - {str(e)}")
            except Exception as e:
                print(f"Ошибка обработки {name}: {e}")
                all_results.append({
                    'Полное наименование ОО': name,
                    'Адрес сайта': url,
                    'Раздел сайта': 'Ошибка обработки',
                    'Статус': f"❌ {str(e)}",
                    'Найдено атрибутов': '',
                    'Отсутствуют': '',
                    'Все обязательные': ''
                })

    output_df = pd.DataFrame(all_results)
    output_df.to_excel("result.xlsx", index=False)

if __name__ == "__main__":
    asyncio.run(main())