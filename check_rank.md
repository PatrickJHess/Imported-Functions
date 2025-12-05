## check_rank helper function

**Purpose:** Checks the full column rank of a matrix.

**Behavior:**

* **Input Validation:** The function ensures the integrity of inputs.  
* **Error Handling:** It raises an exception if the input a NumPy array.  
* **Output:** The function returns truth value of full column rank.
```
def check_rank(array):
  '''
  Checks if a matrix has Full Column Rank (all columns are linearly independent).

    Args:
        array (np.ndarray): The matrix to check.

    Returns:
        bool: True if all columns are independent, False if there is redundancy.
  '''
  import numpy as np
  # Validate input
  if not isinstance(array,np.ndarray):
    raise TypeError("Input must be a NumPy array.")

  # Get number of columns and rows
  # Full column rank implies that number of rows >= number of columns
  array_rows,array_columns=array.shape
  if array_rows<array_columns:
    return False

  # Calculate rank
  array_rank=np.linalg.matrix_rank(array)


  # If is_full_rank  true, least-squares or exact solutions possible
  is_full_rank=array_columns==array_rank
  return is_full_rank```
