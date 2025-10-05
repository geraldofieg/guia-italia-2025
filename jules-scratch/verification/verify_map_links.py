from playwright.sync_api import sync_playwright
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()

    # Get absolute path
    base_path = os.path.abspath(".")

    # Verify index.html
    page.goto(f"file://{base_path}/index.html")
    page.evaluate("document.getElementById('comprar-gopro').scrollIntoView()")
    page.screenshot(path="jules-scratch/verification/verification_pt.png")

    # Verify index_en.html
    page.goto(f"file://{base_path}/index_en.html")
    page.evaluate("document.getElementById('comprar-gopro').scrollIntoView()")
    page.screenshot(path="jules-scratch/verification/verification_en.png")

    # Verify index_it.html
    page.goto(f"file://{base_path}/index_it.html")
    page.evaluate("document.getElementById('comprar-gopro').scrollIntoView()")
    page.screenshot(path="jules-scratch/verification/verification_it.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)