import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './AverageChartComponent.css';

const AverageChartComponent = ({ averages }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // 새로운 데이터가 추가될 때마다 chartData를 업데이트하여 애니메이션을 유발
        setChartData([...averages]);
    }, [averages]);

    return (
        <div className="average-chart-container">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    className="shift-chart"
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sunlight" stroke="#8884d8" name="Avg Sunlight (%)" dot={true} animationDuration={100} />
                    <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Avg Humidity (%)" dot={true} animationDuration={100} />
                    <Line type="monotone" dataKey="powerOutput" stroke="#ff7300" name="Avg Power Output (kW)" dot={true} animationDuration={100} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AverageChartComponent;
