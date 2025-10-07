## parent_folder_subfolder is a helper function for saving files created by *Financial Python*

1. ***It generates a path for saving files created by a notebook.***

2. ***By default it deterimes the current working directory, a folder based on the volume name, and subfolder based on the chapter name.***

3. ***If False is passed as the sole argument, you are prompted for values. Values that are not provided are assigned default values.***

4. ***The Function distingushes between Jupyter and Colab notebooks.***

```python
def parent_folder_subfolder(default=True):
  """
    Interactively determines a project directory structure with smart defaults.

    This function provides a standardized way to define parent, folder, and
    subfolder paths for a project within a Jupyter or Colab notebook. It
    downloads a remote JSON configuration file to look up default paths based
    on the notebook's name (local) or ID (Colab).
    For Jupyter notebooks, regular expressions replace all nonalphanumeric
    characters with blanks and.adds colon after the second word matching
    the JSON configureation file.  If a notebook is not in the configuration
    file default folder and subfolders will be returned. 

    If run interactively (default=False), it prompts the user to either accept
    the suggested default paths or provide their own. If run non-interactively
    (default=True), it returns the determined default paths without a prompt.

    Args:
        default (bool, optional): If True, returns the default paths without
            prompting the user. If False, interactively prompts the user for
            input. Defaults to True.

    Returns:
        tuple[str, str, str]: A tuple containing the sanitized path components:
        (parent_directory, folder, subfolder).

    Side Effects:
        - Downloads a configuration file from a hardcoded remote URL.
        - Prints formatted markdown messages to the notebook display.
        - Prompts for user input from stdin when `default` is False.  
"""
  #Import necessary libraries 
  import os
  import sys
  import json
  import requests
  import re
  from IPython.display import Markdown as md, display
  import ipynbname
  from pathvalidate import sanitize_filepath

  local_name='notebook_id_folders.json'

  # Download and parse the remote configuration file ---
  # NOTE: This URL is hardcoded and may expire, breaking the function.
  url='https://www.dropbox.com/scl/fi/10i8yu4k0wsbx1d706ujt/\
  notebook_id_folders.json?rlkey=elcj4gfnk4j94dqg2mremw7zr&st=dhc8art6&dl=1'
  local_name='notebook_id_folders.json'
  
  # Fetch the content from the URL.
  response=requests.get(url)

  # Write the content to a local file
  with open(local_name, 'wb') as f:
    f.write(response.content)
  
  # Read the local JSON file into a Python dictionary
  with open(local_name, 'r') as f:
    google_dict=json.load(f)

  # Process the configuration for local (non-Colab) use ---
  # Create a new dictionary optimized for lookup by notebook name.
  chapters=[google_dict[key]['Subfolder'] for key in google_dict]
  folders=[google_dict[key]['Folder'] for key in google_dict]
  local_dict={chapter:{'Folder':folder,'Subfolder':chapter} for chapter,folder,id in zip(
    chapters,folders,google_dict.keys())}
  
  # Detect environment and find default values
  is_colab = 'google.colab' in sys.modules
  if is_colab:
    notebook_id=ipynbname.name().split('=')[1]
    default_values=google_dict.get(notebook_id,'Default Folder & Subfolder Not Found')
    if not isinstance(default_values,dict):
      default_value_folder, default_value_subfolder='',''
    else:
      default_value_folder=default_values['Folder']
      default_value_subfolder=default_values['Subfolder']
    default_value_parent='/content/drive/MyDrive'
  else:
    # In a local environment, get the notebook name (e.g., "Chapter_One..."
    notebook_name=ipynbname.name()
    # Reformat the name to match the keys in 'local_dict'
    clean_name=re.sub(r'[^a-zA-Z0-9]',' ',notebook_name)
    clean_name_list=clean_name.split(' ')
    if len(clean_name_list) > 1:
        clean_name_list[1] += ':'
        notebook_name = ' '.join(clean_name_list)
    else:
        notebook_name = clean_name
    default_values=local_dict.get(notebook_name,'Default Folder Not Found')
  
    # Unpack the found default values, with fallbacks for safety.
    if not isinstance(default_values,dict):
      default_value_folder, default_value_subfolder='',''
    else:
      default_value_folder=default_values['Folder']
      default_value_subfolder=default_values['Subfolder']
   
    # Set the default parent directory for local machines
    default_value_parent=os.getcwd()
    
  #Tenatively assign inputs default values
  parent_directory_input= default_value_parent
  folder_input=default_value_folder
  subfolder_input=default_value_subfolder    
    
  if not default:  
    #Interactively prompt the user for input
    display(md(f'###  <font color=green> <center>**Press Enter To Accept Default Values**</center></font>'))
  
     # The 'or default_value' pattern accepts the default if user input is empty.
    parent_directory_input = input(f'Enter the parent directory name (default: {default_value_parent} ):\n ').strip() or default_value_parent
    parent_directory_input=sanitize_filepath(parent_directory_input)
  
    folder_input = input(f'Enter the folder name (default: {default_value_folder} ):\n ').strip() or default_value_folder
    folder_input=sanitize_filepath(folder_input)
  
    subfolder_input = input(f'Enter the subfolder name(default: {default_value_subfolder} ):\n ').strip() or default_value_subfolder
    subfolder_input=sanitize_filepath(subfolder_input)
  
  #Display feedback to the user
  display(md(f'### **✅ Parent Directory...{parent_directory_input}**'))
  if default_value_folder:
    display(md(f'### **✅  Folder...{folder_input}**'))
  else:
    display(md(f'###  **❌ No  Folder**'))
  if default_value_subfolder:
    display(md(f'### **✅  Subfolder...{subfolder_input}**'))
  else:
    display(md(f'### **❌ No Subfolder**'))
  
  #Return the final, sanitized path components 
  return parent_directory_input, folder_input,subfolder_input

