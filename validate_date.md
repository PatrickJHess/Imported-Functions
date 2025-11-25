## validate_date helper function

**Purpose:** This function verifies if a given value is a date or datetime object and converts datetime to date.

**Behavior:**

* If the input is a datetime object, it is converted to a date object (retaining only year, month, and day attributes) to prevent logical errors in date comparisons.  
* **Raises an exception** if the input variable is not a datetime` or date object.

```
def validate_date(datetime_obj):
  """
  Validates input is a date/datetime and returns a date object.

  This helper function checks if the input is either a 
  datetime.datetime or datetime.date object. If it's a 
  datetime.datetime, it converts it to a datetime.date.
  It always returns a datetime.date object.

  Args:
    datetime_obj (datetime.date or datetime.datetime): 
      The input to validate and convert.

  Returns:
    datetime.date: The resulting date object.

  Raises:
    TypeError: If the input is not a datetime.date or 
               datetime.datetime object.
  """
  from datetime import datetime, date
  
  #Validation ---
  
  # Check if the object is of the expected type (date or datetime)
  if not isinstance(datetime_obj, (datetime, date)):
      raise TypeError("Input must be a datetime or date object.")
  
  #Standardization ---
  
  # If the object is a datetime, convert it to a date.
  # This makes the return type consistent.
  if isinstance(datetime_obj, datetime):
    datetime_obj = datetime_obj.date()
  
  # Return the object, which is now guaranteed to be a date object.
  return datetime_obj
  
```
