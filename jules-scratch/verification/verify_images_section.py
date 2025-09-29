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

        # --- Switch to Images Tab ---
        print("Switching to Images tab...")
        images_tab_trigger = page.get_by_role("tab", name="Изображения")
        images_tab_trigger.click()

        # Wait for the images management section to be visible
        print("Waiting for images content...")
        images_header = page.get_by_role("heading", name="Управление изображениями")
        expect(images_header).to_be_visible(timeout=10000)

        # --- Screenshot ---
        time.sleep(2) # Wait for data loading and rendering

        screenshot_path = "jules-scratch/verification/images_verification.png"
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