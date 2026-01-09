## bond_pv helper function

**Purpose:** Calculates the present value of a bond multiple or single discount rates.

**Behavior:**

* **Input Validation:** The function ensures the integrity of inputs.  
* **Error Handling:** It raises an exception if rates, payment daes or amounts, or settlement are invalid.  
* **Output:** Returns the present value, first and second derivatives with respect to discount rates
```
def bond_pv(rates=None, data_dict=None, settlement=None):
  '''Calculates a bond's present value, and its first and second derivatives.

  This function prices a bond by discounting its future cash flows using a
  provided set of continuously compounded interest rates. It also computes the
  first and second derivatives of the present value with respect to the rates,
  which are fundamental inputs for calculating risk measures like dollar duration
  and convexity.

  The time to payment is calculated using an Actual/365.25 day-count convention.
  If the provided array of rates is shorter than the number of payments, the
  last rate is used to extrapolate for all subsequent payments.

  Args:
      rates (float or np.ndarray): The continuously compounded discount rate or an
          array of rates. If a single float is provided, it's applied to all
          cash flows.
      data_dict (dict): A dictionary that must contain the bond's payment data.
          It can optionally specify the settlement date.
          - 'pay_data' (tuple): A required tuple of two NumPy arrays:
            (payment_dates, payment_amounts).
          - 'settlement' (datetime.date): An optional valuation date.
      settlement (datetime.date, optional): The valuation date. This argument is
          used if a settlement date is not found in `data_dict`. It defaults
          to the current system date if not provided elsewhere.

  Returns:
      tuple: A tuple of three floats:
      - Present Value: The bond's price,.
      - First Derivative: The derivative of PV with respect to rates. This is related
        to dollar duration.
      - Second Derivative: The second derivative of PV with respect to rates.
        This is related to the bond's dollar convexity.

  Raises:
      TypeError: If 'pay_data' is not a tuple of two NumPy arrays or if
                 'rates' is not numeric.
      ValueError: If the dates and payments arrays within 'pay_data' are not
                  the same size.
  '''
  # Import necessary libraries
  import numpy as np
  from datetime import date

  # if settlement in dictionary otherwise value passed ir no settlement None
  settlement=data_dict.get('settlement',settlement)
  # settlement date is today if it's not provided
  if settlement is None:
    settlement=date.today()
  pay_data=data_dict['pay_data']

# Validate the structure and types within pay_data
  if not isinstance(pay_data, tuple) or len(pay_data) != 2:
      raise TypeError("'pay_data' must be a tuple of (dates_array, payments_array).")
  if not (isinstance(pay_data[0], np.ndarray) and isinstance(pay_data[1], np.ndarray)):
      raise TypeError("Both items in 'pay_data' must be NumPy arrays.")
  if pay_data[0].size != pay_data[1].size:
      raise ValueError("Dates and payments arrays in 'pay_data' must have the same size.")
  # --- Input Validation ---
    # Convert rates to a NumPy array and validate
  if not hasattr(rates, '__iter__'):
      rates = np.array([rates])
  else:
      rates = np.array(rates)

  if not np.issubdtype(rates.dtype, np.number):
        raise TypeError("'rates' must contain only numeric data.")

  # Calculate the time to each payment in years from the settlement date
  # Convert dates to NumPy datetime64, float difference convert to years
  pay_dates=(np.array(pay_data[0],dtype='datetime64[D]')
             -np.datetime64(settlement)).astype(float)/365.25

  # Ensure there is a discount rate for every payment date
  if rates.size<pay_dates.size:
  #If single rate create an array of that single rate
    if rates.size==1:
      rates=np.full(pay_dates.size,rates[0])
   #If more than one but less then size of pay dates
    else:
      rates=np.append(rates,np.full(pay_dates.size-rates.size,rates[-1]))

  #Calculate pv of each payment and sum to get value
  pv_payments=pay_data[1]*np.exp(-rates*pay_dates)
  value=np.sum(pv_payments)

  #Derivatives for each payment
  derivatives_array=-pay_dates*pv_payments

  #First derivative
  first_derivative=np.sum(derivatives_array)

  #Second derivative
  second_derivative=np.sum(-pay_dates*derivatives_array)
  return value,first_derivative,second_derivative
```
