## adjust_bond_pay_dates


**Purpose:**

Converts scheduled payment dates to actual payment dates by checking for settlement dates.

**Behavior:**

* **Input Validation:** Ensures the integrity of scheduled payment dates using the `validate_date` function.  
* **Error Handling:** Raises an exception if the scheduled date is not a date or datetime object.  
* **Calculations:** Determines the settlement day using the `holiday` library, the `easter` function from `relativedelt.easter`, and the `weekday()` method of the `datetime` object.  
* **Output:** Returns the actual payment date, adjusting the scheduled date to a settlement day if necessary.
```
def adjust_bond_pay_dates(scheduled_date):
  """
    Calculates the next valid business day (Modified Following convention), 
    skipping weekends and US holidays (including Good Friday).

    Args:
        scheduled_date: The scheduled payment date as a datetime or date object.

    Returns:
        The adjusted payment date as a date object.

    Raises:
        TypeError: If the input is not a datetime.date or datetime.datetime object.
  """
  import holidays
  from datetime import datetime,date, timedelta
  from dateutil.easter import easter
  # Validate and correct correc scheduled_date
  if not isinstance(scheduled_date, (datetime, date)):
      raise TypeError("Scheduled Date must be a datetime or date object.")
  # Convert datetime to date objects
  if isinstance(scheduled_date,datetime) :
    scheduled_date=scheduled_date.date()
  # Create the holiday list for the year, including Good Friday
  us_holidays = holidays.US(years=scheduled_date.year)
  us_holidays[easter(scheduled_date.year) - timedelta(days=2)] = 'Good Friday'

  #set initial value of adjusted_paydate
  adjusted_pay_date=scheduled_date

  # Loop as long as the adjusted_pay date is a weekend OR a holiday
  while adjusted_pay_date.weekday() > 4 or adjusted_pay_date in us_holidays:
    adjusted_pay_date += timedelta(days=1)
    # If the date rolls over into a new year, ensure we have the correct holidays.

    if adjusted_pay_date.year not in us_holidays:
      us_holidays.update(holidays.US(years=adjusted_pay_date.year))
  return adjusted_pay_date  
```
