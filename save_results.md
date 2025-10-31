## save_results is a helper function that asks users if they wish to save files created by *Financial Python*.


1. ***The function request user input on the saving the file.***

2. ***save_config dictionary determines the location of saved files.***

3. ***Users are warned if the file will be lost at the termination of run time.***


```
def save_results(save_config={}):
    """
    Interactively prompts the user to confirm and generate a safe save path.

    This function pauses execution and asks the user (y/n) if they want to save
    a file. It is environment-aware:

    - **In Google Colab:** It attempts to use '/content/drive/MyDrive'. If not
      mounted, it will try to mount it. If mounting fails, it falls back
      to the temporary '/content' directory and issues a warning.
    - **In a local environment:** It uses the current working directory.

    The function constructs a full path from the base folder and the optional
    'volume' and 'chapter' subdirectories. All path components are sanitized
    using `pathvalidate`.

    Args:
        save_config (dict, optional): A dictionary containing path components.
            'volume' (str, optional): The name of a top-level subdirectory.
            'chapter' (str, optional): The name of a nested subdirectory.
            'file_name' (str, optional): The final file name.
                Defaults to 'output.txt' if not provided or if sanitization
                results in an empty string.

    Returns:
        str or None: A complete, sanitized, absolute string path to the
            file if the user confirms 'y' and path creation succeeds.
            Returns None if the user chooses 'n' or if an error occurs.
    
    Example:
        config = {
            'volume': 'My_Notebooks',
            'chapter': 'Chapter_01',
            'file_name': 'results.json'
        }
        save_path = save_results(config)
        
        # User inputs 'y'
        
        if save_path:
            # save_path might be '/content/drive/MyDrive/My_Notebooks/Chapter_01/results.json'
            print(f"Saving to: {save_path}")
            # ... proceed to write file ...
    """
    import os
    import sys
    from pathlib import Path
    from pathvalidate import sanitize_filepath
    from IPython.display import display, Markdown as md

    # --- 1. Get user's choice (y/n) ---
    default_value = "n"
    prompt = f"❓ Do you want to save the file? (y/n) (press enter for n): "

    # The 'or default_value' part assigns the default if input is empty
    choice = input(prompt) or default_value

    while choice not in ['y', 'n']:
        choice = input(prompt).strip().lower()

    # --- 2. Handle "No" ---
    if choice == 'n':
        display(md(f'###***❌ File Not Saved***.'))
        return None

    # --- 3. Handle "Yes" ---
    display(md(f"###***⌛ Generating A Path***"))
    isColab = 'google.colab' in sys.modules

    # --- Get and sanitize config values ---
    # Sanitize individual components first. Provide sensible string defaults.
    volume = sanitize_filepath(save_config.get('volume', ''))
    chapter = sanitize_filepath(save_config.get('chapter', ''))
    file_name = sanitize_filepath(save_config.get('file_name', 'output.txt'))
    
    # Ensure file_name is not empty after sanitization
    if not file_name:
        file_name = 'output.txt'

    # Build subfolder path (os.path.join handles empty strings well)
    subfolder = os.path.join(volume, chapter)

    # --- Drive/Folder Logic ---
    base_folder = ''
    drive_path = '/content/drive/MyDrive'
    
    if isColab:
      if os.path.exists(drive_path):
        base_folder = drive_path
      else:
        try:
          from google.colab import drive
          drive.mount('/content/drive')
          base_folder = drive_path
        except Exception as e:
          base_folder = '/content' # Fallback
          display(md(f"### ⚠️ ** Drive Mount Failed:** {e}. Saving to temporary '/content' folder."))
    else:
      base_folder = os.getcwd() # Not in Colab, use current directory

    # --- Path Creation ---
    try:
        # Create the full directory path
        full_folder_path = os.path.join(base_folder, subfolder)
        path_obj = Path(full_folder_path)
        path_obj.mkdir(parents=True, exist_ok=True)
        
        # Join the sanitized directory path and sanitized file name
        final_path_str = os.path.join(str(path_obj), file_name)

        display(md(f'### ✅ **File Path Generated:**\n`{final_path_str}`'))
        
        # *** FIXED WARNING ***
        # Correctly check if the base folder is the temporary one
        if base_folder == '/content':
            display(md(f'### ⚠️ *File is in a temporary location and will be lost on runtime restart.*'))

        # --- THIS IS THE RETURN VALUE ---
        return final_path_str

    except Exception as e:
        display(md(f'### ❌ **ERROR Creating Directory:**'))
        print(e)
        return None
~~~
