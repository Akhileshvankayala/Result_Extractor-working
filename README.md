# Student Result Extractor

A comprehensive web application for extracting and analyzing student academic results from the AU Pulse result portal. The application allows bulk extraction of student results based on roll number ranges and provides detailed analysis with export capabilities.

## 🎯 Features

- **Bulk Result Extraction**: Extract results for multiple students using roll number ranges
- **Automated Web Scraping**: Uses Selenium to scrape results from AU Pulse portal
- **Smart Data Processing**: Automatically categorizes students by status (Active, Backlog, Not Found, Error)
- **Result Analysis**: Provides summary statistics and sorting by CGPA
- **Export Capabilities**: Download results in Excel (.xlsx) and PDF formats
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **Real-time Processing**: Live updates during the extraction process

## 🏗️ Architecture

The application follows a client-server architecture:

- **Frontend**: Next.js with TypeScript, Tailwind CSS, and Radix UI components
- **Backend**: Flask API with web scraping capabilities
- **Data Processing**: Pandas for data manipulation and analysis
- **Export**: Excel generation with openpyxl, PDF generation with FPDF

## 📋 Prerequisites

### Backend Requirements
- Python 3.7+
- Chrome browser
- ChromeDriver executable

### Frontend Requirements
- Node.js 18+
- npm or yarn

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd result-extractor
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

Update the ChromeDriver path in `config.py`:
```python
CHROMEDRIVER_PATH = r"path\to\your\chromedriver.exe"
```

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install Node.js dependencies:
```bash
npm install
```

## 🖥️ Usage

### Starting the Application

1. **Start the Backend Server**:
```bash
cd backend
python app.py
```
The Flask server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**:
```bash
cd frontend
npm run dev
```
The Next.js application will run on `http://localhost:3000`

### Using the Application

1. **Enter Roll Number Range**: 
   - Input the starting roll number (e.g., `24EG105G01`)
   - Input the ending roll number (e.g., `24EG105G30`)

2. **Extract Results**: 
   - Click "Get Results" to start the extraction process
   - The application will scrape results for all roll numbers in the range

3. **View Results**: 
   - Results are automatically sorted by CGPA (highest to lowest)
   - Students are categorized by status:
     - **Active**: Students with valid CGPA
     - **Backlog**: Students with pending subjects
     - **Not Found**: Roll numbers that don't exist
     - **Error**: Failed to extract information

4. **Export Data**: 
   - Download results as Excel file for detailed analysis
   - Download results as PDF for formal reporting

## 📊 Roll Number Format

The application supports roll numbers in the format: `YYEGXXXGNN`

Where:
- `YY`: Year (e.g., 24 for 2024)
- `EG`: Department code (e.g., EG for Engineering)
- `XXX`: Course/Branch code (e.g., 105)
- `G`: Section identifier
- `NN`: Student number (01-99)

Example: `24EG105G01` to `24EG105G30`

## 🔧 Configuration

### Backend Configuration (`backend/config.py`)

```python
# URL of the result portal
RESULT_URL = "https://aupulse.campx.in/aupulse/ums/results"

# Path to ChromeDriver executable
CHROMEDRIVER_PATH = r"path\to\chromedriver.exe"

# Selenium options for web scraping
SELENIUM_OPTIONS = [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--window-size=1920,1080',
]
```

## 📁 Project Structure

```
result-extractor/
├── backend/
│   ├── app.py                 # Flask application entry point
│   ├── config.py              # Configuration settings
│   ├── scraper.py             # Web scraping logic
│   ├── utils.py               # Utility functions
│   ├── result_processor.py    # Data processing and analysis
│   ├── report_excel.py        # Excel report generation
│   ├── report_pdf.py          # PDF report generation
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── app/
│   │   ├── page.tsx           # Main application page
│   │   ├── layout.tsx         # Application layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── roll-number-form.tsx    # Input form component
│   │   ├── results-table.tsx       # Results display component
│   │   ├── loading-state.tsx       # Loading indicator
│   │   ├── download-buttons.tsx    # Export functionality
│   │   └── ui/                     # Reusable UI components
│   ├── package.json           # Node.js dependencies
│   └── next.config.js         # Next.js configuration
└── README.md                  # This file
```

## 🔍 API Endpoints

### POST `/api/results`
Extract student results for a range of roll numbers.

**Request Body:**
```json
{
  "start_roll": "24EG105G01",
  "end_roll": "24EG105G30"
}
```

**Response:**
```json
{
  "results": [
    {
      "roll_number": "24EG105G01",
      "cgpa": "8.5",
      "status": "Active"
    }
  ],
  "summary": {
    "active": 25,
    "backlog": 3,
    "not_found": 2,
    "error": 0
  }
}
```

### POST `/api/download/excel`
Download results as Excel file.

### POST `/api/download/pdf`
Download results as PDF file.

## 🛠️ Technologies Used

### Backend
- **Flask**: Web framework
- **Selenium**: Web scraping automation
- **Pandas**: Data manipulation and analysis
- **openpyxl**: Excel file generation
- **FPDF**: PDF file generation
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **Next.js**: React framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component library
- **Lucide React**: Icon library
- **React Hook Form**: Form management

## ⚠️ Critical Requirements & Warnings

### 🚨 ChromeDriver Setup (MANDATORY)
The application **WILL NOT WORK** without proper ChromeDriver setup:

1. **Download ChromeDriver**: 
   - Visit https://chromedriver.chromium.org/
   - Download the version that matches your Chrome browser version
   - To check your Chrome version: `Chrome Menu → Help → About Google Chrome`

2. **Place ChromeDriver**:
   - Extract the `chromedriver.exe` file
   - Place it in the `backend/` directory OR add it to your system PATH
   - Update the path in `backend/config.py`:
     ```python
     CHROMEDRIVER_PATH = r"C:\path\to\your\chromedriver.exe"
     ```

3. **Version Compatibility**:
   - ⚠️ **Chrome and ChromeDriver versions MUST match**
   - Mismatched versions will cause the application to crash
   - Update both Chrome and ChromeDriver regularly

### 🔧 System Requirements
- **Chrome Browser**: Must be installed and up-to-date
- **ChromeDriver**: Must match Chrome version exactly
- **Python 3.7+**: Required for backend
- **Node.js 18+**: Required for frontend

### ⚠️ Important Notes

1. **ChromeDriver Execution**: The ChromeDriver process must be able to run and access Chrome
2. **Network**: Stable internet connection required for web scraping
3. **Rate Limiting**: The application includes delays to avoid overwhelming the target server
4. **Legal Compliance**: Ensure you have permission to scrape the target website
5. **Data Privacy**: Handle student data responsibly and in compliance with privacy regulations
6. **Firewall/Antivirus**: May need to whitelist ChromeDriver and the application

## 🐛 Troubleshooting

### Common Issues

1. **ChromeDriver Error**: 
   - **Most Common Issue**: Download the correct ChromeDriver version for your Chrome browser
   - Update the `CHROMEDRIVER_PATH` in `config.py`
   - Ensure ChromeDriver has execute permissions
   - Try running ChromeDriver manually to test: `chromedriver.exe --version`

2. **"ChromeDriver not found" Error**:
   - Verify the file path in `config.py` is correct
   - Check if ChromeDriver exists in the specified location
   - Try using absolute path instead of relative path

3. **"Chrome failed to start" Error**:
   - Chrome browser must be installed
   - Update Chrome to the latest version
   - Check if Chrome is blocked by antivirus/firewall

4. **Connection Error**: 
   - Check if the AU Pulse portal is accessible
   - Verify internet connection
   - Check if university portal is down for maintenance

5. **Invalid Roll Number Format**: 
   - Ensure roll numbers follow the `YYEGXXXGNN` format
   - Check for typos in roll number input

6. **Backend Not Accessible**: 
   - Ensure Flask server is running on port 5000
   - Check for port conflicts
   - Verify CORS settings

## 📈 Future Enhancements

- [ ] Support for multiple university portals
- [ ] Database integration for result history
- [ ] Advanced analytics and visualizations
- [ ] Email notifications for result updates
- [ ] User authentication and role management
- [ ] Batch processing with progress tracking
- [ ] Result comparison across semesters

## 📄 License

This project is for educational purposes. Please ensure compliance with the terms of service of the target website and applicable data protection laws.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions, please create an issue in the repository or contact the development team.

---

**Developed with ❤️ for academic result analysis**