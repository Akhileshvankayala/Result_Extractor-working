import re
from typing import List

def generate_roll_numbers(start_roll: str, end_roll: str) -> List[str]:
    """
    Generates a list of roll numbers from start_roll to end_roll (inclusive).
    Assumes roll numbers are in the format: YYEGXXXGNN (e.g., 24EG105G01)
    """
    # Extract prefix and numeric part (case-insensitive, supports all sections)
    pattern = r"^(\d{2}[A-Z]{2}\d{3}[A-Z])(\d{2})$"
    start_roll = start_roll.strip().upper()
    end_roll = end_roll.strip().upper()
    print(f"Raw start_roll: '{start_roll}', Raw end_roll: '{end_roll}'", flush=True)
    m_start = re.match(pattern, start_roll)
    m_end = re.match(pattern, end_roll)
    print("m_start:", m_start, flush=True)
    print("m_end:", m_end, flush=True)
    if not m_start or not m_end or m_start.group(1) != m_end.group(1):
        raise ValueError("Roll numbers must have the same prefix and valid format.")
    prefix = m_start.group(1)
    start_num = int(m_start.group(2))
    end_num = int(m_end.group(2))
    if start_num > end_num:
        raise ValueError("Start roll number must be less than or equal to end roll number.")
    roll_numbers = [f"{prefix}{str(i).zfill(2)}" for i in range(start_num, end_num + 1)]
    return roll_numbers

def validate_roll_number(roll_number: str) -> bool:
    """
    Validates a roll number format (YYEGXXXGNN)
    """
    # Accepts all sections, case-insensitive
    pattern = r"^\d{2}[A-Z]{2}\d{3}[A-Z]\d{2}$"
    processed = roll_number.strip().upper()
    print(f"Validating roll_number: '{roll_number}' -> '{processed}'", flush=True)
    result = bool(re.match(pattern, processed))
    print(f"Validation result: {result}", flush=True)
    return result
