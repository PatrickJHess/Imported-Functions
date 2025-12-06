## bond_pay_data helper function

**Purpose:** To determine actual bond payment dates and corresponding amounts based on scheduled payment dates.

**Behavior:**

* **Input Validation:** The function ensures the integrity of inputs.  
* **Error Handling:** It raises an exception if the provided values for coupon, maturity, settlement, or payment frequency are invalid.  
* **Output:** The function returns two NumPy arrays: one containing the actual payment dates and another containing the respective payment amounts.
```
def bond_pay_data(maturity,coupon,settlement=None,freq=2):
  '''
  Function calculates payment Dates And Amounts.
  maturity is a datetime object and coupon is a real number.
  Required arguments are maturity and annual coupon.
  If provided, the value of settlement is a datetime object;
  otherwise defaults to date.today()
  freq defaults to semi-annual but accepts freq equal
  to 1 for annual, 2 for semi-annal, 4 for quarterly, and 12 for monthly.
  The function assumes a par value of 100.
  Returns Numpy arrays of dates and amounts.

   Raises:
      TypeError: If maturity or settlement are not datetime objects.
      ValueError: If inputs are not logically valid (e.g., negative coupon,
                  maturity before settlement).
  '''
  from datetime import datetime,date 
  from dateutil.relativedelta import relativedelta
  import pandas as pd
  import numpy as np
  from IPython.display import display, Markdown as md

  #Validate the data- maturity, coupon, settlement, freq
  #maturity
  maturity=validate_date(maturity)

  #coupon
  try:
      coupon = float(coupon)
      if coupon < 0:
          raise ValueError("coupon rate cannot be negative.")
  except (ValueError, TypeError):
      raise ValueError("coupon must be a valid number.")

  #settlement
  if settlement is None:
      settlement = date.today()
  else:
      settlement=validate_date(settlement)

  #freq
  if int(freq) not in [1,2,4,12]:
      display(md(f"### ⚠️  your assigned freq {freq} it must be (1, 2, 4, or 12)\
      \n  ###    semi-annual assumed (2)."))
      freq=int(2)

# check maturity greater than settlement
  if maturity<=settlement:
    raise ValueError("maturity must be greater than the settlement date")

  if coupon==0:
    #Adjust maturity for nonsettlement day and return date and face value
    adjust_maturity=adjust_bond_pay_dates(maturity)
    return np.array([adjust_maturity]),np.array([100.0])

  #get scheduled payment dates from helper function scheduled_pay_dates
  scheduled_dates=scheduled_pay_dates(maturity,settlement,freq)

  #NumPy array of pay_dates: list comprehension with adjust_bond_pay_dates
  pay_dates=np.array([adjust_bond_pay_dates(scheduled) for scheduled in scheduled_dates])

  #calculate payments
  #coupon divided by freq at each date
  pay=np.full(len(pay_dates),coupon/freq)

  #Add principal payment as last cash payment
  pay[-1]+=100

  return pay_dates,pay
```
