from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get the absolute path to the index.html file
        file_path = os.path.abspath("index.html")

        # Go to the local HTML file and anchor
        page.goto(f"file://{file_path}#dicas")

        # Wait for the page to load
        page.wait_for_load_state('networkidle')

        # Find the list associated with Roma tips, and select the first match.
        roma_list = page.locator("h3:has-text('Roma') + ul").first

        # Take a screenshot of the list
        screenshot_path = "jules-scratch/verification/verification.png"
        roma_list.screenshot(path=screenshot_path)

        browser.close()

if __name__ == "__main__":
    run()