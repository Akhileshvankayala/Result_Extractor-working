import pandas as pd
from typing import List, Dict, Tuple, Any

def process_results(results: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], Dict[str, int]]:
    """
    Processes and sorts the results list of dicts.
    Returns sorted results and a summary dict.
    """
    if not results:
        return [], {'active': 0, 'backlog': 0, 'not_found': 0, 'error': 0}
    df = pd.DataFrame(results)
    # Mark CGPA as float where possible, else NaN
    def parse_cgpa(val):
        try:
            return float(val)
        except (ValueError, TypeError):
            return None
    df['cgpa_num'] = df['cgpa'].apply(parse_cgpa)
    # Sort: valid CGPA (desc), then backlog, then not found, then error
    def sort_key(row):
        if row['status'] == 'Active' and row['cgpa_num'] is not None:
            return (0, -row['cgpa_num'])
        elif row['status'] == 'Backlog':
            return (1, 0)
        elif row['status'] == 'Student does not exist.':
            return (2, 0)
        else:
            return (3, 0)
    # Sort using a custom key (since sort_values by a list of tuples is not valid)
    df = df.iloc[sorted(range(len(df)), key=lambda i: sort_key(df.iloc[i]))].reset_index(drop=True)
    # Prepare summary
    summary = {
        'active': int(((df['status'] == 'Active') & (df['cgpa_num'].notnull())).sum()),
        'backlog': int((df['status'] == 'Backlog').sum()),
        'not_found': int((df['status'] == 'Student does not exist.').sum()),
        'error': int((df['status'] == 'Error in extracting information.').sum())
    }
    # Drop helper column
    df = df.drop(columns=['cgpa_num'])
    # Convert back to list of dicts
    sorted_results = df.to_dict(orient='records')
    return sorted_results, summary
