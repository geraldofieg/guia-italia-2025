import os
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get the absolute path to the index.html file
        # The script is in jules-scratch/verification, so we need to go up two levels
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        file_path = os.path.join(base_dir, 'index.html')

        # Navigate to the local HTML file
        page.goto(f'file://{file_path}')

        # Locate the section with the specified ID
        garmin_section = page.locator('#compra-sonar-garmin')

        # Ensure the section is visible
        expect(garmin_section).to_be_visible()

        # Scroll to the section to make sure it's in view for the screenshot
        garmin_section.scroll_into_view_if_needed()

        # Take a screenshot of the specific element
        screenshot_path = 'jules-scratch/verification/garmin_stores.png'
        garmin_section.screenshot(path=screenshot_path)

        browser.close()
        print(f"Screenshot saved to {screenshot_path}")

if __name__ == "__main__":
    run_verification()