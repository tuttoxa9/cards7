import asyncio
import time
from playwright.async_api import async_playwright, expect

# Тестовые данные
ADMIN_EMAIL = "e@x.com"
ADMIN_PASSWORD = "111111"
TEST_REVIEW_AUTHOR = f"Тестовый Автор {int(time.time())}"
TEST_REVIEW_TEXT = "Это тестовый отзыв, созданный для проверки полного цикла работы. Все должно быть идеально!"
AVATAR_FILE_PATH = "public/placeholder-user.jpg"
SCREENSHOT_PATH = "jules-scratch/verification/e2e_verification.png"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # --- 1. Вход в админ-панель ---
            print("1. Вход в админ-панель...")
            await page.goto("http://localhost:3000/admin", timeout=60000)
            await page.fill('input[id="email"]', ADMIN_EMAIL)
            await page.fill('input[id="password"]', ADMIN_PASSWORD)
            await page.click('button[type="submit"]')

            # Ждем загрузки дашборда, который по умолчанию открывается на разделе "Карточки"
            await expect(page.get_by_role("heading", name="Карточки")).to_be_visible(timeout=30000)
            print("   ...Успешный вход.")

            # --- 2. Переход к управлению отзывами и создание нового ---
            print("2. Создание нового отзыва...")
            # Кликаем на вкладку "Отзывы" в навигации, используя правильную роль "tab"
            await page.get_by_role("tab", name="Отзывы").click()
            await expect(page.get_by_role("heading", name="Управление отзывами")).to_be_visible(timeout=10000)

            await page.get_by_role("button", name="Добавить отзыв").click()

            # Ждем появления формы в боковой панели (drawer)
            await expect(page.get_by_role("heading", name="Добавить новый отзыв")).to_be_visible(timeout=10000)

            # --- 3. Заполнение формы и загрузка аватара ---
            print("3. Заполнение формы и загрузка аватара...")
            await page.fill('input[placeholder="Иван Иванов"]', TEST_REVIEW_AUTHOR)
            await page.locator('textarea[placeholder="Ваш отзыв..."]').fill(TEST_REVIEW_TEXT)

            # Загружаем файл
            async with page.expect_file_chooser() as fc_info:
                await page.locator('.cursor-pointer', has_text="Нажмите или перетащите").click()
            file_chooser = await fc_info.value
            await file_chooser.set_files(AVATAR_FILE_PATH)

            # Ждем, пока загрузка завершится и появится URL
            await expect(page.locator('img[alt="Загрузить аватар"]')).to_be_visible(timeout=20000)
            print("   ...Аватар успешно загружен.")

            # --- 4. Сохранение отзыва ---
            print("4. Сохранение отзыва...")
            await page.get_by_role("button", name="Сохранить отзыв").click()

            # Ждем, пока боковая панель закроется
            await expect(page.get_by_role("heading", name="Добавить новый отзыв")).not_to_be_visible(timeout=10000)
            print("   ...Отзыв сохранен.")

            # --- 5. Проверка на публичной странице ---
            print("5. Проверка на публичной странице...")
            await page.goto("http://localhost:3000/reviews", timeout=60000)

            # Ждем появления нашего нового отзыва
            await expect(page.get_by_text(TEST_REVIEW_AUTHOR)).to_be_visible(timeout=10000)
            await expect(page.get_by_text(TEST_REVIEW_TEXT)).to_be_visible(timeout=10000)
            print("   ...Новый отзыв найден на странице.")

            # Делаем финальный скриншот
            await page.screenshot(path=SCREENSHOT_PATH)
            print(f"Финальный скриншот E2E-теста сохранен: {SCREENSHOT_PATH}")

        except Exception as e:
            print(f"Произошла ошибка во время E2E-теста: {e}")
            # В случае ошибки делаем скриншот текущего состояния
            await page.screenshot(path="jules-scratch/verification/e2e_error.png")
            print("Сделан скриншот ошибки: jules-scratch/verification/e2e_error.png")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())