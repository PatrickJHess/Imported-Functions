## create_workbook is a helper function that creates Excel workbooks from DataFrames created by *Financial Python*.


1. ***The creates a new workbook, adds or replaces a sheet in an existing one.***

2. ***The requied arguments are the names of the sheet and DataFrame.***

4. ***The dictionaries save_config and fill_config are optional and dete3mine if the graph is saved to file and if fill colors are added.***

```
def create_workbook(sheet_name, df, save_config={}):
  """
  Writes a DataFrame to a specific sheet in an Excel workbook and auto-fits
  column widths for readability.

  Args:
      sheet_name (str): The name of the sheet to create or replace.
      df (pd.DataFrame): The DataFrame to write.
      save_config (dict, optional): A dictionary passed to the 
          save_results() function to determine the save path.
          'file_name' will be auto-populated if not provided.
  """
  import pandas as pd
  from IPython.display import display, Markdown as md
  import openpyxl
  from openpyxl.utils import get_column_letter
  import os
  import re # Added for sanitizing sheet name

  # --- 1. Sanitize Sheet Name ---
  # Remove illegal characters: * ? : \ / [ ]
  sane_sheet_name = re.sub(r'[\\*?:/\[\]]', '', sheet_name)
  # Truncate to 31 characters (Excel limit)
  if len(sane_sheet_name) > 31:
      sane_sheet_name = sane_sheet_name[:31]
  if not sane_sheet_name:
      sane_sheet_name = "Sheet1" # Fallback if name is all illegal chars
  # --- 2. Get Save Path ---
  # Set a default filename if one isn't provided in the config
  if not save_config.get('file_name', False):
      save_config['file_name'] = 'output.xlsx'
  path_filename=save_results(save_config=save_config)
  if path_filename is None:
    path_filename=save_config.get('file_name','output.xlsx')
  # Write the DataFrame to the Excel file
  try:
    # If the file doesn't exist, create an empty one so 'append' mode works.
    if not os.path.exists(path_filename):
        # Create a new workbook by saving an empty DataFrame
        pd.DataFrame().to_excel(path_filename)
    with pd.ExcelWriter(
        path_filename,
        mode='a',
        engine='openpyxl',
        if_sheet_exists='replace',
        datetime_format='YYYY-MM-DD' # Use a standard date format
    ) as writer:
        df.to_excel(writer, sheet_name=sheet_name, index=True)
    #Format with openpyxl
    workbook=openpyxl.load_workbook(path_filename)
    # Did the sheet get written?
    try:
        ws = workbook[sheet_name]
    except KeyError:
        print(f"Error: Sheet '{sheet_name}' not found after writing.")
        return
      # Iterate through all columns in the worksheet
    for col_idx, column_cells in enumerate(ws.columns, 1):
        max_length = 0
        # Get the column letter (e.g., A, B, C)
        column_letter = get_column_letter(col_idx)

        # Find the maximum length of any cell in the column
        for cell in column_cells:
            try:
                # Add 2 to the length for a little extra padding
                if len(str(cell.value)) > max_length:
                    max_length = len(str(cell.value))
            except:
                pass # Ignore errors for empty cells

        # Adjust the column width
        adjusted_width = max_length + 2
        ws.column_dimensions[column_letter].width = adjusted_width
  #Delete Sheet1 if it exists in workbook
    if 'Sheet1' in workbook.sheetnames and sheet_name != 'Sheet1' and len(workbook.sheetnames) > 1:
        del workbook['Sheet1']
    workbook.save(path_filename)
    display(md(f"###***✅ Successfully wrote and formatted sheet {sheet_name} in {path_filename}***"))
  except Exception as e:
    display(md(f"### ❌ **ERROR during Excel write/format:**"))
    print(e)
~~~ 
