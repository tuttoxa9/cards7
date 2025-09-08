import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # 1. Navigate to the page on the correct port
        await page.goto("http://localhost:3003")

        # Give the page a moment to load fully
        await page.wait_for_load_state("networkidle")

        # 2. Take a screenshot of the hero banner to check layout and text size
        await page.screenshot(path="jules-scratch/verification/very-final-hero.png")

        # 3. Scroll down, hover over a nav link, and take a screenshot of the header
        await page.evaluate("window.scrollBy(0, 500)")
        await asyncio.sleep(0.5) # Wait for scroll effects

        header = page.get_by_role("banner")
        catalog_link = header.get_by_role("link", name="Каталог")
        await catalog_link.hover()
        await asyncio.sleep(0.5) # Wait for hover transition

        await page.screenshot(path="jules-scratch/verification/very-final-header.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
