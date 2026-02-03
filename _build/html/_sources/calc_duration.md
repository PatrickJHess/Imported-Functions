## calc_duration helper function

**Purpose:** Calculates duration

**Behavior:**

* **Input Validation:** The function ensures the integrity of inputs.  
* **Error Handling:** defaults guess if not a number  
* **Output:** Returns duration
```
def calc_duration(maturity, coupon,price=None,
                  rates=None,settlement=None, freq=2):
  '''
  Calculates modified duration for a bond.
  Helper functions:
   calc_ytm, bond_pay_data, bond_pv
  Arguments are:
    price: current price of the bond defaults to 100 (par yield)
    maturity:
      bond's maturity date-datetime or date object (required for calc_ytm, bond_pay_data)
    coupon: bond's annual coupon of par (reqired for calc_ytm and bond_pay_data)
    settlement: bond's settlement date (optional default to current date)
    freq: payment frequency  (optional defaults to 2 for semi-annual (1,2,4 or 12))
  '''
  from datetime import date

  # check setlement
  if settlement is None:
    settlement=date.today()
  # calculation of rates
  # if bond sells for 100 ytm calculated from par yield
  if price == 100:
    rates=2*np.log(1+coupon/200)

  # if rates None or zero, calculate as yield to maturity
  if not rates:
        if price is None:
            raise ValueError("Must provide either 'rates' (yield) or 'price'.")
        # FIX: Use the actual 'price' variable, not hardcoded 100
        rates = calc_ytm(price, maturity, coupon, settlement=settlement)

  # Handle iterable rates (e.g. if user passed a list of rates)
  elif hasattr(rates, '__iter__'):
        rates = rates[0]
  # Sanity check: If rate calculation resulted in <= 0, try recalculating
  if isinstance(rates, (int, float)) and rates <= 0:
         # Fallback to Par yield if calculation failed or input was bad
         rates = calc_ytm(100, maturity, coupon, settlement=settlement)

  # data for bond_pv function
  pay_data=bond_pay_data(maturity,coupon,settlement=settlement)
  data_dict={'pay_data':pay_data,'settlement':settlement}

  # calculate present value and first derivative
  value,derivative_first,_=bond_pv(rates=rates,data_dict=data_dict)

  # calculate duration and return value
  duration=-derivative_first/value
  return duration
```
