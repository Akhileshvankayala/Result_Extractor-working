
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.chrome.service import Service
import time
from config import RESULT_URL, CHROMEDRIVER_PATH, SELENIUM_OPTIONS

def get_student_result(roll_number, driver=None):
    """
    Scrapes the result for a single roll number.
    Returns a dict: { 'roll_number': ..., 'cgpa': ..., 'status': ... }
    """
    close_driver = False
    if driver is None:
        options = webdriver.ChromeOptions()
        for opt in SELENIUM_OPTIONS:
            options.add_argument(opt)
        service = Service(CHROMEDRIVER_PATH)
        driver = webdriver.Chrome(service=service, options=options)
        close_driver = True
    try:
        driver.get(RESULT_URL)
        wait = WebDriverWait(driver, 15)
        # Enter roll number
        roll_input = wait.until(EC.presence_of_element_located((By.ID, "rollNo")))
        roll_input.clear()
        roll_input.send_keys(roll_number)
        # Select 'General' in dropdown
        dropdown = wait.until(EC.element_to_be_clickable((By.ID, "examType")))
        dropdown.click()
        # Wait for dropdown options to appear and select 'General'
        general_option = wait.until(EC.presence_of_element_located((By.XPATH, "//li[contains(text(), 'General')]")))
        general_option.click()
        # Click 'Get Result' button
        get_result_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@type='submit' and contains(text(), 'Get Result')]")))
        get_result_btn.click()
        # Wait for result or error popup
        time.sleep(2)  # Wait for result to load or popup to appear
        # Check for error popup
        try:
            popup = driver.find_element(By.XPATH, "//*[contains(text(), 'Cannot find student with roll no')]")
            if popup:
                return {"roll_number": roll_number, "cgpa": "--", "status": "Student does not exist."}
        except NoSuchElementException:
            pass
        # Extract CGPA
        try:
            cgpa_div = wait.until(EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'MuiBox-root') and contains(@class, 'css-bmlw8o') and contains(text(), 'CGPA')]")))
            cgpa_text = cgpa_div.text.strip()
            if cgpa_text.startswith("CGPA :"):
                cgpa_value = cgpa_text.split(":")[-1].strip()
                if cgpa_value == "--":
                    return {"roll_number": roll_number, "cgpa": "--", "status": "Backlog"}
                else:
                    return {"roll_number": roll_number, "cgpa": cgpa_value, "status": "Active"}
        except TimeoutException:
            return {"roll_number": roll_number, "cgpa": "--", "status": "Error in extracting information."}
        return {"roll_number": roll_number, "cgpa": "--", "status": "Error in extracting information."}
    except Exception as e:
        return {"roll_number": roll_number, "cgpa": "--", "status": "Error in extracting information."}
    finally:
        if close_driver:
            driver.quit()
