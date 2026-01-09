## single_newton_raphson helper function

**Purpose:** Use the Newton-Raphson method to find root of a function

**Behavior:**

* **Input Validation:** The function ensures the integrity of inputs.  
* **Error Handling:** If function not specified or derivative is equivalent to zero  
* **Output:** Returns the numer of guesses and root of the function
```
def single_newton_raphson(target_value, function=None, data=None, num_attempts=50,
                          guess=0.0001, tolerance=1e-5):
    """
    Finds a root of a function using the Newton-Raphson method.

    Args:
        target_value (float): The target value we want the function to return.
        function (callable): A function that takes a guess and optional data,
                             and returns a tuple (value, derivative).
        data (any, optional): Additional data to pass to the function.
        num_attempts (int): Maximum number of iterations.
        guess (float): Initial guess for the root.
        tolerance (float): The desired precision of the result.

    Returns:
        tuple: (number_of_guesses, final_guess, final_value)
        str: An error message if no solution is found.
    """
    if function is None:
      raise TypeError("function must be specified")
    import numpy as np
    num_guesses = 0

    for num_guesses in range(num_attempts):
       #Ignore second derivative
       value, derivative,*other = function(guess, data)

        # Calculate how far off we are from the target
       error = value - target_value

        # Check for convergence
       if abs(error) <= tolerance:
            return num_guesses, guess, value

        # Avoid division by zero
       if np.isclose(derivative, 0):
            print("No solution found: derivative is zero.")
            return num_guesses+1, guess, value

        # Newton-Raphson update step
        # We use value - target_value (the error) as f(x)
        # The standard formula is x_n+1 = x_n - f(x_n)/f'(x_n)
       guess = guess - error / derivative
    print("No solution found after {} attempts.".format(num_attempts))
    return num_guesses+1, guess, value
```
