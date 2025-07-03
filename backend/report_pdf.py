from fpdf import FPDF
from io import BytesIO

def generate_pdf(results, summary=None):
    """
    Generates a PDF file from results (list of dicts) and optional summary.
    Returns a BytesIO object containing the PDF file.
    """
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    # Title
    pdf.cell(200, 10, txt="Student Results", ln=True, align='C')
    pdf.ln(5)
    # Table header
    if results:
        headers = list(results[0].keys())
        for header in headers:
            pdf.cell(40, 10, header, border=1)
        pdf.ln()
        # Table rows
        for row in results:
            for header in headers:
                pdf.cell(40, 10, str(row[header]), border=1)
            pdf.ln()
    else:
        pdf.cell(200, 10, txt="No results available.", ln=True, align='C')
    # Summary
    if summary:
        pdf.ln(5)
        pdf.cell(200, 10, txt="Summary", ln=True, align='L')
        for key, value in summary.items():
            pdf.cell(100, 10, f"{key.capitalize().replace('_', ' ')}: {value}", ln=True, align='L')
    # Output to BytesIO (ensure correct format for Flask send_file)
    pdf_bytes = pdf.output(dest='S').encode('latin1')
    output = BytesIO(pdf_bytes)
    output.seek(0)
    output.name = 'results.pdf'
    return output
