## create_payoff_matrix helper function

**Purpose:** Creates a payoff matrix from a DataFrame of bonds need for bootstrapping term structure

**Behavior:**

* **Input Validation:** The function ensures the integrity of inputs.  
* **Error Handling:** It raises an exception if fpr wrong data inputs.  
* **Output:** the payoff matrix and the dates for the columns
```
def create_payoff_matrix(df_bonds,settlement=None,freq=2):
  '''
    Constructs a cash flow matrix (Payoff Matrix) for a portfolio of bonds.

    This function iterates through a DataFrame of bonds, calculates their individual
    cash flows based on maturity and coupon rate, and aligns them into a matrix
    where rows represent bonds and columns represent unique payment dates.

    Parameters
    ----------
    df_bonds : pd.DataFrame
        A DataFrame containing bond data.
        - Index: Maturity dates (datetime-like).
        - Column 'Coupon': Annual coupon rate (e.g., 5.0 for 5%).
    settlement : datetime-like, optional
        The settlement date for calculation. Cash flows before this date are ignored.
        Defaults to date.today() if None.
    freq : int, optional
        Payment frequency per year. Must be 1 (Annual), 2 (Semi-annual),
        4 (Quarterly), or 12 (Monthly). Defaults to 2.

    Returns
    -------
    tuple (np.ndarray, list)
        - np.ndarray: A 2D array of floats (Rows=Bonds, Cols=Dates).
        - list: A sorted list of datetime.date objects corresponding to the matrix columns.

    Raises
    ------
    ValueError
        - If inputs are invalid type.
        - If a generated row contains only zeros (maturity < settlement).
        - If a duplicate bond (row) is detected.
        - If the final matrix is not full rank (linear dependency).


  '''
  import numpy as np
  import pandas as pd
  from datetime import date
  import warnings


  # Validate inputs

  # df_bonds
  if not isinstance((df_bonds),pd.DataFrame):
     raise ValueError("df_bonds must be a Pandas DataFrame")

  #settlement
  if settlement is None:
      settlement = date.today()
  else:
      settlement=validate_date(settlement)

  #freq
  if int(freq) not in [1,2,4,12]:
      print(f"⚠️  your assigned {freq} to freq. It must be (1, 2, 4, or 12)\
      \n      semi-annual assumed (2).")
      freq=int(2)

  # Initialize the list payment_rows
  payment_rows=[]

  # Get payment data for the bonds
  # Only consider bonds with maturities greater than the settlement date
  payment_data=[bond_pay_data(maturity,coupon,settlement,freq=freq) for maturity,coupon in
               zip(df_bonds.index,df_bonds['Coupon'])if maturity.date()>=settlement]

  # Calculate the unique payment dates for bond with maturities >= settlement
  # create_unique_function takes the list or arrays and returns a chronololgically
  # sorted dictionary with keys equal to unique dates and values column location
  column_mapping=unique_pay_dates(payment_data)

  # Iterate through payment_data list
  for data in payment_data:

    # initialize an array of zeros with length equal unique dates length
    this_row=np.zeros(len(column_mapping))

    # Use dictionary get method to determine the column number of the bond's payments
    payment_columns=[column_mapping.get(pay_date) for pay_date in data[0]]
    for columns,payment in zip(payment_columns,data[1]):
     this_row[columns]=payment

    # Check if row is zero
    if np.all(np.isclose(this_row,0)):
      if payment_rows:
        last_valid=payment_rows[-1]
      else:
        last_valid=None
      raise ValueError(f'The row has no payment amounts {new_row}, last valid row {last_valid}')
    payment_rows.append(this_row)

  # Check the rank before
  if not check_rank(np.array(payment_rows)):
    raise ValueError("The payoff matrix is not full rank; check the DataFrame")

  return np.array(payment_rows),list(column_mapping.keys())``
