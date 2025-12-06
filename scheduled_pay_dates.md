## scheduled_pay_dates

**Purpose:**

Generates the scheduled payment dates for bonds, beginning from the settlement date.

**Behavior:**

* **Input Validation:** The function ensures the integrity of maturity and settlement dates using the validate_date function.  
* **Error Handling:** An exception is raised if the maturity or settlement inputs are not date or datetime objects.  
* **Calculations:** Payments are calculated by iterating backward from the maturity date.  
* **Output:** Returns a chronologically ordered list of scheduled payment dates.
```
ef scheduled_pay_dates(maturity,settlement=None,freq=2):
  '''
    Generates a chronological list of coupon payment dates from settlement to maturity.
    The function calculates dates backward from the maturity date based on the
    specified frequency. It handles standard bond market "end-of-month" logic:
    if the maturity date is the last day of a month, all preceding coupon payments
    are snapped to the last day of their respective months.
    Args:
        maturity (datetime.date): The final maturity date of the bond.
            Accepts a date object.
        settlement (datetime.date, optional): The settlement date (start of analysis).
            Coupons falling before this date are excluded. Defaults to date.today().
        freq (int, optional): The number of coupon payments per year.
            Accepted values:
            * 1: Annual, 2: Semi-Annual (Default), 4: Quarterly, 12: Monthly

    Returns:
        list[datetime.date]: A list of coupon dates sorted chronologically
        (earliest to latest), ending with the maturity date..
  '''
  from datetime import datetime,date
  import calendar
  from dateutil.relativedelta import relativedelta

  #Validate the data- maturity, coupon, settlement, freq
  #maturity
  maturity=validate_date(maturity)

  #settlement
  if settlement is None:
      settlement = date.today()
  else:
      settlement=validate_date(settlement)
  #freq
  if int(freq) not in [1,2,4,12]:
      display(md(f"### ⚠️  your assigned freq {freq} it must be (1, 2, 4, or 12)\
     \n     semi-annual assumed (2)."))
      freq=int(2)

# check maturity greater than settlement
  if maturity<=settlement:
    raise ValueError("maturity must be greater than the settlement date")

  # Calculate the number of months between each coupon payment.
  num_months=int(12/freq)

  #Need to check for month_end
  is_month_end = maturity.day == calendar.monthrange(maturity.year, maturity.month)[1]

  dates = []
  pay_date = maturity

  #Loop backward from the maturity date

  while pay_date > settlement:
    dates.append(pay_date)

    # Decrement by the frequency
    pay_date -= relativedelta(months=num_months)

    # Handle Month End Logic
    if is_month_end:
      last_day = calendar.monthrange(pay_date.year, pay_date.month)[1]
      pay_date = date(pay_date.year, pay_date.month, last_day)

  # Return chronologically (sliced backward)
  return dates[::-1]

  
```
