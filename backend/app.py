from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from utils import generate_roll_numbers, validate_roll_number
from scraper import get_student_result
from result_processor import process_results
from report_excel import generate_excel
from report_pdf import generate_pdf
import tempfile

app = Flask(__name__)
CORS(app)

@app.route('/api/results', methods=['POST'])
def get_results():
    try:
        data = request.get_json()
        print("Received data:", data)
        start_roll = data.get('start_roll')
        end_roll = data.get('end_roll')
        print("Start roll:", start_roll, "End roll:", end_roll)
        if not (validate_roll_number(start_roll) and validate_roll_number(end_roll)):
            print("Invalid roll number format")
            return jsonify({'error': 'Invalid roll number format.'}), 400
        try:
            roll_numbers = generate_roll_numbers(start_roll, end_roll)
        except Exception as e:
            print("Error in generate_roll_numbers:", e)
            return jsonify({'error': str(e)}), 400
        results = []
        for roll in roll_numbers:
            print("Processing roll number:", roll)
            result = get_student_result(roll)
            results.append(result)
        sorted_results, summary = process_results(results)
        print("Processed results. Summary:", summary)
        return jsonify({'results': sorted_results, 'summary': summary})
    except Exception as e:
        print("Unhandled exception in /api/results:", e)
        import traceback; traceback.print_exc()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

@app.route('/api/download/excel', methods=['POST'])
def download_excel():
    data = request.get_json()
    results = data.get('results', [])
    summary = data.get('summary', {})
    excel_io = generate_excel(results, summary)
    return send_file(
        excel_io,
        as_attachment=True,
        download_name='results.xlsx',
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )

@app.route('/api/download/pdf', methods=['POST'])
def download_pdf():
    data = request.get_json()
    results = data.get('results', [])
    summary = data.get('summary', {})
    pdf_io = generate_pdf(results, summary)
    return send_file(
        pdf_io,
        as_attachment=True,
        download_name='results.pdf',
        mimetype='application/pdf'
    )

if __name__ == '__main__':
    app.run(debug=True)
