## accrued_interest is a helper function that calculates accrued interest.



1. ***The requied arguments are maturity as datetime and coupon***

2. ***Default values are assigned to bond_type and settlement as a dateime.***

```
def accrued_interest(maturity, coupon, bond_type='Government', settlement=None, freq=2):
  """
  Returns the accrued interest for a bond.

  Uses Actual/Actual for Government bonds or 30/360 for other bond types.
  No accrued interest is calculated if settlement is on a payment date.

  Args:
      maturity (datetime): The maturity date of the bond.
      coupon (float): The annual coupon rate (e.g., 0.05 for 5%).
      bond_type (str, optional): 'Government' or other. Defaults to 'Government'.
      settlement (datetime, optional): The settlement date. Defaults to today.
      freq (int, optional): Coupon frequency per year. Defaults to 2.
  """
  from datetime import datetime,date

  # Normalize maturity and settlement dates to avoid time-of-day issues.
  if isinstance(maturity, datetime): maturity = maturity.date()
  if isinstance(settlement, datetime): settlement = settlement.date()
  if freq not in [1, 2, 4, 12]:
    feqq=2

  #Set maturity, settlement, and coupon dates
#  maturity=date(maturity.year,maturity.month,maturity.day)
  if settlement is None:
    today=date.today()
    settlement=date(today.year,today.month,today.day)
  next_date,last_date=next_last_coupon_dates(maturity,settlement=settlement)
  #Government bonds are actual/actual
  if bond_type == 'Government':
      # Actual/Actual convention
      days_since_last = (settlement - last_date).days
      days_between = (next_date - last_date).days
  #other bonds are 30/360
  else:
      # 30/360 convention
      days_since_last = _days_30_360(last_date, settlement)
      days_between = _days_30_360(last_date, next_date)

  # Avoid division by zero if coupon dates are the same
  if days_between == 0:
      return 0.0

  accrued_ratio = days_since_last / days_between

  # No accrued interest on the actual coupon payment date
  if settlement == next_date:
      accrued_ratio = 0
  #Calculate coupon payment
  periodic_coupon_payment = coupon / freq

  return periodic_coupon_payment * accrued_ratio
~~~
