## accrued_interest is a helper function that calculates accrued interest.



1. ***The requied arguments are maturity as datetime and coupon***

2. ***Default values are assigned to bond_type and settlement as a dateime.***

```
def accrued_interest(maturity, coupon, day_type='Actual/Actual', settlement=None, freq=2):
    """
      Returns the accrued interest for a bond.  Returns the accrued interest for a bond.

    Args:
        maturity (datetime): The maturity date of the bond.
        coupon (float): The annual coupon rate (e.g., 0.05 for 5%).
        day_types:
            Actual/Actual, Actual/365, Actual/360. and 30/360.
        settlement (datetime, optional): The settlement date. Defaults to today.
        freq (int, optional):
        Coupon frequency per year: 1 (annual). 2 (semi-annual)
                                    4 (quarterly), 12 (monthly)
                                    Defaults to 2. 
    """
    from datetime import date
    import calendar
    from dateutil.relativedelta import relativedelta

    #Validate Data
    maturity = validate_date(maturity)
    
    if settlement is None:
        settlement = date.today()
    else:
        settlement = validate_date(settlement)

    if freq not in [1, 2, 4, 12]:
        print(f"⚠️ Warning: Freq {freq} invalid. Assumed Semi-Annual (2).")
        freq = 2

    try:
        coupon = float(coupon)
        if coupon < 0: raise ValueError
    except:
        raise ValueError("Coupon must be a positive number.")

    # Find the Correct Coupon Period
    # Get all the bond's payment dates
    pay_dates = scheduled_pay_dates(maturity, settlement=settlement, freq=freq)
 
    # Should sorted but check
    pay_dates.sort()
    
    # The first date after the settlement date is the next coupon date
    next_coupon = None
    for d in pay_dates:
        if d >= settlement:
            next_coupon = d
            break
            
    # Handle case where bond has matured
    if next_coupon is None:
        return 0.0

    #Calculate Previous Coupon Date
    num_months = int(12 // freq)
    prev_coupon = next_coupon - relativedelta(months=num_months)

    # Check for Month End adjustment on the calculated previous date
    is_next_month_end = next_coupon.day == calendar.monthrange(maturity.year, maturity.month)[1]
    
    if is_next_month_end:
        last_day_of_prev_month = calendar.monthrange(prev_coupon.year, prev_coupon.month)[1]
        prev_coupon = date(prev_coupon.year, prev_coupon.month, last_day_of_prev_month)

    # In Python date math, (Settlement - Prev) automatically excludes the end date, 
    # which correctly represents "days held".

    accrued_value = 0.0

    if day_type == 'Actual/Actual':
        days_since_last = (settlement - prev_coupon).days
        days_between = (next_coupon - prev_coupon).days
        # Formula: Coupon/Freq * (DaysHeld / DaysInPeriod)
        accrued_value = (coupon / freq) * (days_since_last / days_between)

    elif day_type == '30/360':
        days_since_last = _days_30_360(prev_coupon, settlement)
        # Formula: Coupon * (Days360 / 360)
        accrued_value = coupon * (days_since_last / 360.0)

    elif day_type == 'Actual/360':
        days_since_last = (settlement - prev_coupon).days
        accrued_value = coupon * (days_since_last / 360.0)

    elif day_type == 'Actual/365':
        days_since_last = (settlement - prev_coupon).days
        accrued_value = coupon * (days_since_last / 365.0)
        
    else:
        # Fallback
        print(f"⚠️ Warning: Unknown day_type {day_type}. Using Actual/Actual.")
        days_since_last = (settlement - prev_coupon).days
        days_between = (next_coupon - prev_coupon).days
        accrued_value = (coupon / freq) * (days_since_last / days_between)

    return accrued_value

~~~
