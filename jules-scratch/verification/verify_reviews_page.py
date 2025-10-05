from playwright.sync_api import sync_playwright, Page, expect

def run_verification(page: Page):
    """
    This test verifies that the /reviews page loads correctly,
    displays the main heading, and captures a screenshot of the layout.
    """
    # 1. Arrange: Go to the reviews page.
    page.goto("http://localhost:3000/reviews")

    # 2. Assert: Confirm the main heading is visible.
    # This ensures the page has loaded before we take the screenshot.
    heading = page.get_by_role("heading", name="Отзывы наших коллекционеров")
    expect(heading).to_be_visible()

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/reviews_page.png")
    print("Screenshot captured successfully.")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            run_verification(page)
        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    main()