import time
from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:3000/admin")

        print("Logging in...")
        expect(page.get_by_label("Email")).to_be_visible(timeout=10000)
        page.get_by_label("Email").fill("e@x.com")
        page.get_by_label("Пароль").fill("111111")
        page.get_by_role("button", name="Войти").click()

        print("Waiting for dashboard...")
        expect(page.get_by_role("heading", name="Карточки")).to_be_visible(timeout=15000)
        print("Dashboard loaded.")

        print("Opening settings panel...")
        page.locator("button:has(svg.lucide-settings)").click()

        print("Waiting for settings drawer...")
        expect(page.get_by_role("heading", name="Настройки", exact=True)).to_be_visible(timeout=5000)

        print("Checking for tabs...")
        expect(page.get_by_role("tab", name="Подключение")).to_be_visible()
        expect(page.get_by_role("tab", name="Интерфейс")).to_be_visible()
        expect(page.get_by_role("tab", name="Обслуживание")).to_be_visible()
        print("Tabs are present.")

        print("Checking connection...")
        page.get_by_role("button", name="Проверить соединение").click()

        # Wait for the result to appear by looking for the "Последняя проверка" text
        expect(page.locator("p", has_text="Последняя проверка:")).to_be_visible(timeout=5000)
        print("Connection check complete.")

        time.sleep(1)

        screenshot_path = "jules-scratch/verification/settings_redesign_verification.png"
        print(f"Taking screenshot at {screenshot_path}")
        page.screenshot(path=screenshot_path)

        print("Verification script completed successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")
        raise

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)