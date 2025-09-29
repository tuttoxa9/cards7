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

        print("Switching to Reviews tab...")
        page.get_by_role("tab", name="Отзывы").click()

        print("Waiting for reviews content...")
        expect(page.get_by_role("heading", name="Управление отзывами")).to_be_visible(timeout=10000)

        print("Clicking 'Add Review' button...")
        page.get_by_role("button", name="Добавить отзыв").click()

        print("Waiting for 'Add Review' drawer...")
        drawer_header = page.get_by_role("heading", name="Добавить новый отзыв")
        expect(drawer_header).to_be_visible(timeout=5000)

        time.sleep(1)

        screenshot_path = "jules-scratch/verification/add_review_verification.png"
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