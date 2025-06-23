import asyncio
import aiohttp
from .spider import SchoolChecker

async def async_run_parser(name, url):
    async with aiohttp.ClientSession(headers={'User-Agent': 'Mozilla/5.0'}) as session:
        checker = SchoolChecker(name, url)
        results = await checker.check_school(session)
    return results

def run_parser(name, url):
    return asyncio.run(async_run_parser(name, url))