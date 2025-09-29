import time
from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the admin login page
        page.goto("http://localhost:3000/admin")

        # --- Login ---
        print("Logging in...")
        expect(page.get_by_label("Email")).to_be_visible(timeout=10000)
        page.get_by_label("Email").fill("e@x.com")
        page.get_by_label("Пароль").fill("111111")
        page.get_by_role("button", name="Войти").click()

        # Wait for the dashboard to load
        print("Waiting for dashboard...")
        expect(page.get_by_role("heading", name="Карточки")).to_be_visible(timeout=15000)
        print("Dashboard loaded.")

        # --- Open Settings Panel ---
        print("Opening settings panel...")
        # The button itself doesn't have a name, so we locate it by the icon it contains
        settings_button = page.locator("button:has(svg.lucide-settings)")
        expect(settings_button).to_be_visible()
        settings_button.click()

        # Wait for the settings drawer to appear
        print("Waiting for settings drawer...")
        settings_header = page.get_by_role("heading", name="Настройки", exact=True)
        expect(settings_header).to_be_visible(timeout=5000)

        # --- Screenshot ---
        time.sleep(1) # Wait for animations

        screenshot_path = "jules-scratch/verification/settings_verification.png"
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