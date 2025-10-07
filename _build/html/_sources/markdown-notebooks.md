## one-y-axis is a helper function for plotting graphs created by *Financial Python*.


1. ***The function plots a single or multiple series on a single y-axis.***

2. ***The x axis must be iterable.***

3. ***The y axis data must be iterable; e.g. list of NumPy arrays.***

4. ***The dictionaries save_config and fill_config are optional and determine if the graph is saved to file and if fill colors are added.***

```'py
def one_y_axis(x_data, y_data_list, title, series_labels, xlabel, ylabel,
                       markers, figure_size, y_limits,save_config={}, fill_config={},
                       colors=None):
    '''
    Plots data on a single y-axis.

    Args:
        x_data (array-like): Data for the x-axis.
        y_data_list (list of array-like): A list of datasets for the y-axis.
        title (str): The title of the graph.
        series_labels (list of str): Identifiers for each data series in the legend.
        xlabel (str): The label for the x-axis.
        ylabel (str): The label for the y-axis.
        markers (list of str): The markers to use for each series.
        figure_size (tuple): The width and height of the figure in inches.
        y_limits (tuple): The minimum and maximum values for the y-axis.
        save_config (dict, optional): Configuration for saving the file.
            Keys: 'File Name', 'Folder'. Defaults to {}.
        fill_config (dict, optional): Configuration for filling areas.
            Keys: 'Between', 'Start', 'End', 'Colors', 'Labels', 'Alpha'. Defaults to {}.
        colors (list of str, optional): Colors for each series. If None, uses a default colormap.
    Raises:
        ValueError: If input lists for series, markers, or colors do not match the number of y-datasets.
    '''
    import os
    from matplotlib import pyplot as plt    
    num_series = len(y_data_list)
    # --- Input Validation''''
    if not all(len(lst) == num_series for lst in [series_labels, markers]):
        raise ValueError("The 'series_labels' and 'markers' lists must have the same length as 'y_data_list'.")

    if colors and len(colors) != num_series:
        raise ValueError("The 'colors' list must have the same length as 'y_data_list'.")

    # --- Plotting Setup ---
    fig = plt.figure(figsize=figure_size)
    fig.suptitle(title)
    plt.style.use('ggplot')

    if colors is None:
        # Generate a default color cycle if none are provided
        colors = plt.cm.viridis_r(np.linspace(0, 1, num_series))

    # --- Plot Data Series ---
    for i in range(num_series):
        plt.plot(x_data, y_data_list[i], label=series_labels[i], marker=markers[i], color=colors[i])

    # --- Handle Fill Area ---
    if fill_config.get('Between'):
        if len(fill_config['Between']) > 2:
            raise ValueError("The 'Between' key in fill_config can contain a maximum of two indices.")
        
        # Assuming 'fill_function' is defined and returns necessary parameters
        start, end, alpha, color, label = fill_function(fill_config, x_data)
        
        if len(fill_config['Between']) == 2:
            y1_index, y2_index = fill_config['Between']
            plt.fill_between(x_data[start:end], y_data_list[y1_index][start:end], y_data_list[y2_index][start:end],
                             color=color, alpha=alpha, label=label)
        else:
            y_index = fill_config['Between'][0]
            plt.fill_between(x_data[start:end], y_data_list[y_index][start:end],
                             color=color, alpha=alpha, label=label)

    # --- Final Touches ---
    plt.ylim(y_limits)
    plt.xlabel(xlabel)
    plt.ylabel(ylabel)
    plt.legend()
    plt.tight_layout()

    # --- Save Figure ---
    
    if save_config:
        # Assuming 'file_graph' is defined and handles path creation
        path,file_name = file_graph(save_config,title)
        full_path=os.path.join(path,file_name)
        plt.savefig(full_path, dpi=300, bbox_inches='tight')

    plt.show()```
