import pandas as pd
from openpyxl import Workbook
from openpyxl.utils.dataframe import dataframe_to_rows
from io import BytesIO

def generate_excel(results, summary=None):
    """
    Generates an Excel file from results (list of dicts) and optional summary.
    Returns a BytesIO object containing the Excel file.
    """
    df = pd.DataFrame(results)
    wb = Workbook()
    ws = wb.active
    ws.title = "Results"
    # Write results table
    for r in dataframe_to_rows(df, index=False, header=True):
        ws.append(r)
    # Optionally add summary at the bottom
    if summary:
        ws.append([])
        ws.append(["Summary"])
        for key, value in summary.items():
            ws.append([key.capitalize().replace('_', ' '), value])
    # Save to BytesIO (ensure correct format for Flask send_file)
    output = BytesIO()
    wb.save(output)
    output.seek(0)
    # Set a name attribute for Flask send_file (Flask >=2.0)
    output.name = 'results.xlsx'
    return output
