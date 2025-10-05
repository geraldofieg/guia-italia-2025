from playwright.sync_api import sync_playwright
import os

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Verify index.html
    page.goto(f"file://{os.path.abspath('index.html')}")
    page.evaluate("document.getElementById('comprar-unieuro').scrollIntoView()")
    page.screenshot(path="jules-scratch/verification/unieuro_pt.png")

    # Verify index_en.html
    page.goto(f"file://{os.path.abspath('index_en.html')}")
    page.evaluate("document.getElementById('comprar-unieuro').scrollIntoView()")
    page.screenshot(path="jules-scratch/verification/unieuro_en.png")

    # Verify index_it.html
    page.goto(f"file://{os.path.abspath('index_it.html')}")
    page.evaluate("document.getElementById('comprar-unieuro').scrollIntoView()")
    page.screenshot(path="jules-scratch/verification/unieuro_it.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)