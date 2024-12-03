import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import './PieChart.css';
import processData from './dataProcessor';
/**
 * PieChart Component
 * 
 * The `PieChart` component visualizes the distribution of spending categories using a doughnut
 * chart from the Chart.js library, specifically the `Doughnut` component from `react-chartjs-2`.
 * This component dynamically updates the chart data and colors based on the transaction data 
 * passed in as a prop, enabling real-time reflections of spending patterns. The chart layout 
 * includes a custom legend that aligns with each chart segment’s color, making the chart 
 * easily interpretable at a glance.
 * 
 * Dependencies:
 * - React: Core library for building UI, with `useEffect` for reacting to changes in transactions.
 * - `react-chartjs-2` and `chart.js/auto`: Provides the `Doughnut` chart component with
 *   automatic registration of necessary Chart.js components. The `Doughnut` chart renders a 
 *   circular graph representing the spending data.
 * - `processData` (Custom Function): Imported from `dataProcessor`, `processData` handles 
 *   transaction processing, returning chart labels, data points, and color assignments.
 * 
 * State:
 * - `chartData`: Maintains the current labels, data values, and colors for the doughnut chart. 
 *   `chartData` is updated whenever `transactions` changes, keeping the chart synchronized 
 *   with the latest transaction data.
 * 
 * Example usage:
 * <PieChart transactions={transactionData} />
 * 
 * Props:
 * - `transactions` (Array): An array of transaction objects. Each transaction contains data
 *   that categorizes spending, used to calculate the distribution across categories in `processData`.
 */
const PieChart = ({ transactions }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [],
                borderWidth: 1,
            },
        ],
    });

    /**
     * useEffect Hook - Data Processing
     * 
     * This `useEffect` hook watches for changes in `transactions`. When a new transaction 
     * is added, the hook invokes `processData`, a helper function that extracts categories, 
     * values, and colors from `transactions`. The resulting data is stored in `chartData` 
     * to render updated labels, values, and background colors.
     * 
     * Key Functions:
     * - `processData`: Accepts `transactions` as input and returns a structured object containing:
     *   - `labels`: Category names.
     *   - `data`: Numerical values representing spending for each category.
     *   - `colors`: Background colors for each category in the chart.
     * 
     * Example Usage:
     * - Called implicitly on `transactions` changes to keep `chartData` consistent with current 
     *   transaction data.
     * 
     * Dependencies:
     * - `[transactions]`: This dependency array ensures the effect re-runs only when 
     *   `transactions` changes, avoiding unnecessary re-renders.
     */
    useEffect(() => {
        if (transactions && transactions.length > 0) { // Check if transactions are available
            const { labels, data, colors } = processData(transactions);
            setChartData({
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: colors,
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [transactions]);

    /**
     * options - Chart.js Options Configuration
     * 
     * The `options` object customizes the appearance and behavior of the `Doughnut` chart.
     * 
     * Key Properties:
     * - `cutout`: Defines the cutout percentage for the doughnut hole, here set to 50% to 
     *   create a pronounced doughnut shape.
     * - `plugins.legend.display`: Hides the default legend provided by Chart.js, as the 
     *   component utilizes a custom legend.
     * 
     * Usage:
     * - Passed as a prop to `Doughnut`, these options override the default settings.
     */
    const options = {
        cutout: '50%',
        plugins: {
            legend: { display: false },
        },
    };

    return (
        <div className="pie-chart-container">
            <Doughnut data={chartData} options={options} />
            
            {/* Custom Legend */}
            <div className="chart-legend">
                {chartData.labels && chartData.labels.map((label, index) => (
                    <div key={index} className="legend-item">
                        <span
                            className="legend-color"
                            style={{
                                backgroundColor:
                                    chartData.datasets[0]?.backgroundColor?.[index] || '#000',
                            }}
                        ></span>
                        <span>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PieChart;
