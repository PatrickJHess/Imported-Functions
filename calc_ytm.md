## calc_ytm helper function

**Purpose:** Calculates yield to maturity

**Behavior:**

* **Input Validation:** The function ensures the integrity of inputs.  
* **Error Handling:** Raises type error if price not a number; defaults guess if not a number  
* **Output:** Returns yield to maturity
```
def calc_ytm(price,maturity,coupon,guess=0.01,settlement=None,num_attempts=50,freq=2):
  """
  Calculates the Yield to Maturity (YTM) for a bond.

  YTM is the total annualized return an investor can expect if they hold the bond
  until it matures. This function finds the discount rate that equates the
  present value of the bond's future cash flows to its current market price
  using the Newton-Raphson numerical method.

  Args:
    price (float): The current market price of the bond.
    maturity (date): The bond's maturity date.
    coupon (float): The annual coupon rate of the bond (e.g., 0.05 for 5%).
    guess (float, optional): An initial guess for the YTM. Defaults to 0.01 (1%).
                           A good guess can speed up the calculation.
    settlement (date, optional): The date the bond is purchased.
                                 Defaults to the current date.

  Returns:
    float: The calculated Yield to Maturity (YTM) of the bond.
 
  Raises:
      TypeError: If 'price' is not a number
  """
  from datetime import date
  import numpy as np

  # If the initial guess is not a number (NaN), reset it to a default value.
  if np.isnan(guess):
    guess=max(0.01,coupon/100)
 
  # Validaed price is number
  if np.isnan(price): 
    raise TypeError('Price must be a number')
  
  # If no settlement date is provided, use today's date.
  if settlement is None:
    settlement=date.today()
  # Call bond_pay_data() to get the schedule of all future payments
  pay_data=bond_pay_data(maturity,coupon,settlement=settlement,freq=freq)

  # Create a dictionary to pass necessary data to the bond_pv function
  data_dict={'settlement':settlement,'pay_data':pay_data}

  #Newton-Raphson technique passes data to bond_pv to update estimates
  number_iterations,final_result,final_value=single_newton_raphson(price,
                                                                  function=bond_pv,
                                                                  data=data_dict,
                                                                  guess=guess)

  #Failure to converge causes alert, but final shows value at maximum tries
  return final_result
```
