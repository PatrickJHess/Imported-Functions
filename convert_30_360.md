## convert_30_360 retuns day between dates according to the 30/360 rule.




```
def convert_30_360(start_date, end_date): 
  """
  Calculates the number of days between two dates using the 30U/360
  (US Bond Basis) convention.

  Args:
      start_date: The beginning date of the period.
      end_date: The ending date of the period.

  Returns:
      The number of days calculated using the 30U/360 convention.
  """
  from datetime import date
  import calendar
  d1, m1, y1 = start_date.day, start_date.month, start_date.year
  d2, m2, y2 = end_date.day, end_date.month, end_date.year

  # Helper to check if a date is the last day of February
  def is_last_day_of_feb(d: date) -> bool:
      return d.month == 2 and d.day == calendar.monthrange(d.year, d.month)[1]

  # --- Apply the 30U/360 rules ---

  # Rule 1: If both dates are the last day of Feb, change end_date's day to 30.
  if is_last_day_of_feb(start_date) and is_last_day_of_feb(end_date):
      d2 = 30

  # Rule 2: If start_date is 31 or last day of Feb, change its day to 30.
  if d1 == 31 or is_last_day_of_feb(start_date):
      d1 = 30

  # Rule 3: If end_date is 31 AND start_date's day was changed to 30, change end_date's day to 30.
  if d2 == 31 and d1 == 30:
      d2 = 30

  # --- Perform the final calculation ---
  day_count = (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1)

  return day_count
```
