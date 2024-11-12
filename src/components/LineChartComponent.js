import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ data }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (data.length === 0) return;

        setChartData((prevData) => {
            const updatedData = [...prevData, data[data.length - 1]];
            if (updatedData.length > 20) {
                return updatedData.slice(-20); // 최신 20개 데이터만 유지
            }
            return updatedData;
        });
    }, [data]);

    return (
        <div className="left-container">
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="lightQuantity"
                        stroke="#8884d8"
                        name="Sunlight"
                        dot={false}
                        animationDuration={10}
                    />
                    <Line
                        type="monotone"
                        dataKey="humidity"
                        stroke="#82ca9d"
                        name="Humidity (%)"
                        dot={false}
                        animationDuration={10}
                    />
                    <Line
                        type="monotone"
                        dataKey="batteryVoltage"
                        stroke="#ff7300"
                        name="Battery(V)"
                        dot={false}
                        animationDuration={10}
                    />
                    <Line
                        type="monotone"
                        dataKey="solarVoltage"
                        stroke="#297300"
                        name="Solar(V)"
                        dot={false}
                        animationDuration={10}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChartComponent;
