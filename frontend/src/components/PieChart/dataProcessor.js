/**
 * processData - Transaction Data Processor
 * 
 * The `processData` function is a utility that transforms an array of transaction objects 
 * into a structured format suitable for data visualization, particularly for pie or doughnut 
 * charts. It aggregates transaction amounts by category, ensuring each category has a 
 * corresponding label, data value, and color for consistent chart rendering. This function 
 * serves as a bridge between raw transaction data and visual components, encapsulating the 
 * logic needed to convert individual transactions into chart-ready data.
 * 
 * Constants:
 * - `COLORS`: An array of predefined hex color codes used to assign consistent colors to 
 *   categories in the pie chart. The array is cyclically accessed to ensure color coverage 
 *   even when there are more categories than unique colors.
 * 
 * Function Parameters:
 * - `transactions` (Array): An array of transaction objects. Each object is expected to 
 *   have a `Category` (string) and `Amount` (number) property, representing the spending 
 *   category and its corresponding monetary value. This array is required to be non-empty 
 *   for accurate processing.
 * 
 * Example usage:
 * const { labels, data, colors } = processData(transactions);
 */

const COLORS = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
];

/**
 * processData - Aggregates Transaction Data by Category
 * 
 * This function takes an array of transactions and returns an object containing:
 * - `labels`: An array of unique category names derived from transaction data, representing 
 *   spending categories to be displayed as chart segments.
 * - `data`: An array of numeric values that correspond to the absolute total amount for each 
 *   category, calculated by summing positive or negative values to reflect overall spending 
 *   without considering direction.
 * - `colors`: An array of color codes, each assigned to a category label in the `labels` 
 *   array, enabling consistent and visually distinct segments in charts.
 * 
 * Function Workflow:
 * 1. **Data Validation**: Checks if `transactions` is null or empty, logging a warning to the 
 *    console if so, and returning empty arrays to prevent rendering issues.
 * 2. **Category Aggregation**: Uses `Array.prototype.reduce` to iterate over transactions, 
 *    summing the absolute values of `Amount` fields by `Category`. This creates a totals 
 *    object where each key is a category and the value is the cumulative amount.
 * 3. **Label and Data Extraction**: Converts the keys (categories) and values (amounts) from 
 *    the totals object into `labels` and `data` arrays, respectively, for easy integration 
 *    into charts.
 * 4. **Color Assignment**: Maps `COLORS` cyclically to each category label to ensure each 
 *    chart segment has a distinct color.
 * 
 * Dependencies and Integration:
 * - This function does not have external dependencies and is intended to work with components 
 *   like `PieChart` that expect structured data for rendering.
 * - `console.warn` and `console.log` statements are used for error handling and debugging, 
 *   aiding developers in tracing data flow.
 * 
 * Returns:
 * - An object containing `labels`, `data`, and `colors` arrays, structured for direct use 
 *   in chart configurations.
 * 
 * Edge Cases:
 * - If a transaction lacks a `Category` or `Amount`, it is ignored during aggregation.
 * - The function gracefully handles empty or null `transactions` arrays to prevent runtime 
 *   errors in visual components.
 */
const processData = (transactions) => {
    if (!transactions || transactions.length === 0) {
        console.warn("No transactions provided to processData");
        return { labels: [], data: [], colors: [] };
    }

    // Aggregates transaction amounts by category
    const categoryTotals = transactions.reduce((totals, transaction) => {
        const { Category, Amount } = transaction; // Ensure the casing matches
        if (Category && Amount !== undefined) {
            totals[Category] = (totals[Category] || 0) + Math.abs(Amount);
        }
        return totals;
    }, {});

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    const colors = labels.map((_, index) => COLORS[index % COLORS.length]);

    console.log("Processed Labels:", labels);
    console.log("Processed Data:", data);
    console.log("Processed Colors:", colors);

    return { labels, data, colors };
};

export default processData;
