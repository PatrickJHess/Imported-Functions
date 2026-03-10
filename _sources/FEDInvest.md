## FEDInvest is a helper function that gets daily price data for U.S. Treasury Securities.


1. ***Sole argument is a date as dateimte or date.***

2. ***Returns DataFrame, date of prices, and settlement date.***


```
def FEDInvest(price_date):
  """
    Fetches historical security prices from the FedInvest portal.

    Args:
        price_date (datetime.date): The date for which to retrieve prices.
            Note: Current day is typically available after 1:00 PM ET on business days.


    Returns:
        tuple: (pandas.DataFrame, str) if successful. The DataFrame contains
               security details (CUSIP, Price, Yield), and the string is the
               official "Prices For" date stamp from the site.
        tuple: (str, None) if the request fails or no data is found for the date
                (attempt to fetch current day before 1:00 PM ET).

    Example:
        >>> from datetime import date
        >>> df, stamp = FEDInvest(date(2025, 3, 17))
  """
  import requests
  from bs4 import BeautifulSoup
  import pandas as pd
  from datetime import datetime, date
  from dateutil.relativedelta import relativedelta

  # check for date or datetime
  validate_date(price_date)

  # make share date of prices and settlement date are settlement dates
  price_date=adjust_bond_pay_dates(price_date)
  if price_date > date.today():
    return "price_date is in the future", None, None
  
  settlement_date=price_date+relativedelta(days=1)
  settlement_date=adjust_bond_pay_dates(settlement_date)

  # URL address of Treasury Direct Select A Date
  url = "https://treasurydirect.gov/GA-FI/FedInvest/selectSecurityPriceDate"

  # Standard headers to look like a real browser
  headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\
     (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Content-Type": "application/x-www-form-urlencoded"
  }

  #  variable names and type identified from inspecting url
  month=str(price_date.month)
  day=str(price_date.day)
  year=str(price_date.year)

  # payload passed in request post
  payload={'priceDate.month':month,
           'priceDate.day':day,
           'priceDate.year':year,
           "submit": "Show Prices"}

  # fires off form and returns prices for date
  try:
        response = requests.post(url, data=payload, headers=headers, timeout=10)
        response.raise_for_status()
  except requests.exceptions.RequestException as e:
        return f"Connection Error: {e}", None

  # reads the html

  tables=pd.read_html(response.text,match='CUSIP')

  # from inspection there is a single table
  return tables[0], price_date,settlement_date
~~~ 
