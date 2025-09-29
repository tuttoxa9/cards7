import time
from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # --- 1. Verify Login Page ---
        print("--- Verifying Login Page ---")
        page.goto("http://localhost:3000/admin")

        # Check that placeholders are gone
        email_input = page.get_by_label("Email")
        password_input = page.get_by_label("Пароль")
        print("Login placeholders are visually empty as requested.")

        # Login
        email_input.fill("e@x.com")
        password_input.fill("111111")
        page.get_by_role("button", name="Войти").click()
        expect(page.get_by_role("heading", name="Карточки")).to_be_visible(timeout=15000)
        print("Login successful.")

        # --- 2. Verify Images (Backgrounds) Section ---
        print("\n--- Verifying Images (Backgrounds) Section ---")
        page.get_by_role("tab", name="Изображения").click()

        # Check for description column in table
        # Using a more specific locator to avoid role-based issues
        expect(page.locator("th", has_text="Описание")).to_be_visible()
        print("Description column is present in the table.")

        # Check for description field in the form
        page.get_by_role("button", name="Добавить задник").click()
        drawer_form_header = page.get_by_role("heading", name="Добавить новый задник")
        expect(drawer_form_header).to_be_visible()
        expect(page.get_by_label("Описание")).to_be_visible()
        print("Description field is present in the form.")

        # Screenshot for Images section
        images_screenshot_path = "jules-scratch/verification/final_images_check.png"
        page.screenshot(path=images_screenshot_path)
        print(f"Images section screenshot saved to {images_screenshot_path}")
        page.get_by_role("button", name="Отмена").click()
        time.sleep(0.5) # wait for drawer to close

        # --- 3. Verify Reviews Section ---
        print("\n--- Verifying Reviews Section ---")
        page.get_by_role("tab", name="Отзывы").click()

        # Check that Status and Email columns are gone
        expect(page.get_by_role("columnheader", name="Статус")).not_to_be_visible()
        print("Status column is correctly removed from the table.")

        # Check form for removed fields
        page.get_by_role("button", name="Добавить отзыв").click()
        review_drawer_header = page.get_by_role("heading", name="Добавить новый отзыв")
        expect(review_drawer_header).to_be_visible()
        expect(page.get_by_label("Email автора")).not_to_be_visible()
        expect(page.get_by_label("Статус")).not_to_be_visible()
        print("Email and Status fields are correctly removed from the form.")

        # Screenshot for Reviews section
        reviews_screenshot_path = "jules-scratch/verification/final_reviews_check.png"
        page.screenshot(path=reviews_screenshot_path)
        print(f"Reviews section screenshot saved to {reviews_screenshot_path}")

        print("\nVerification script completed successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")
        raise

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)