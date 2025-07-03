# Configuration file for backend

# URL of the result portal
RESULT_URL = "https://aupulse.campx.in/aupulse/ums/results"

# Path to the ChromeDriver executable
CHROMEDRIVER_PATH = r"C:\\Users\\HP\\Desktop\\RESULT EXTRACTOR\\chat-jqxjwl1oviemgx8s3pwrywjk-files\\backend\\chromedriver.exe" # Update this if chromedriver is not in PATH

# Selenium options (compatible with modern Chrome)
SELENIUM_OPTIONS = [
    '--headless=new',  # Use new headless mode for Chrome >= 109
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--window-size=1920,1080',
]
