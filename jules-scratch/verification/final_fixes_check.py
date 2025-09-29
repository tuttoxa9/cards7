import time
from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://localhost:3000/admin")

        print("Logging in...")
        page.get_by_label("Email").fill("e@x.com")
        page.get_by_label("Пароль").fill("111111")
        page.get_by_role("button", name="Войти").click()
        expect(page.get_by_role("heading", name="Карточки")).to_be_visible(timeout=15000)
        print("Login successful.")

        # --- 1. Create a review to ensure data exists ---
        print("\n--- Creating a test review ---")
        page.get_by_role("tab", name="Отзывы").click()
        page.get_by_role("button", name="Добавить отзыв").click()

        # Fill form
        expect(page.get_by_role("heading", name="Добавить новый отзыв")).to_be_visible()
        page.get_by_label("Имя автора").fill("Тестовый Автор")
        page.get_by_label("Рейтинг").click()
        page.get_by_role("option", name="4 звезд").click()
        page.get_by_label("Текст отзыва").fill("Это тестовый отзыв для проверки функционала.")
        page.get_by_role("button", name="Сохранить отзыв").click()

        # Wait for the new review to appear in the table
        print("Waiting for the new review to appear...")
        new_review_row = page.locator("tr", has_text="Тестовый Автор")
        expect(new_review_row).to_be_visible(timeout=10000)
        print("Test review created successfully.")

        # --- 2. Verify Reviews Section CRUD Actions ---
        print("\n--- Verifying Reviews Section ---")
        # Open actions menu for the newly created review
        new_review_row.get_by_role("button", name="Открыть меню").click()

        # Click "Edit"
        page.get_by_role("button", name="Изменить").click()
        expect(page.get_by_role("heading", name="Редактирование отзыва")).to_be_visible()
        print("Review edit form opened successfully.")

        # Screenshot for Reviews edit form
        reviews_screenshot_path = "jules-scratch/verification/final_reviews_edit_check.png"
        page.screenshot(path=reviews_screenshot_path)
        print(f"Reviews edit screenshot saved to {reviews_screenshot_path}")
        page.get_by_role("button", name="Отмена").click()
        time.sleep(0.5)

        # --- 3. Verify Images Section CRUD Actions ---
        print("\n--- Verifying Images (Backgrounds) Section ---")
        page.get_by_role("tab", name="Изображения").click()

        # Open actions menu for the first image
        first_image_row = page.locator("table > tbody > tr").first
        expect(first_image_row).to_be_visible(timeout=5000)
        first_image_row.locator("button").click()

        # Click "Edit"
        page.get_by_role("button", name="Изменить").click()
        expect(page.get_by_role("heading", name="Редактировать задник")).to_be_visible()
        print("Image edit form opened successfully.")

        # Screenshot for Images edit form
        images_screenshot_path = "jules-scratch/verification/final_images_edit_check.png"
        page.screenshot(path=images_screenshot_path)
        print(f"Images edit screenshot saved to {images_screenshot_path}")

        print("\nVerification script completed successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")
        raise

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)