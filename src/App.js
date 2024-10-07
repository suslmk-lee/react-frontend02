import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL

const App = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/data`);
            if (response.ok) {
                const result = await response.json();
                const newDataPoint = {
                    time: new Date().toLocaleTimeString(),
                    sunlight: result.sunlight,
                    humidity: result.humidity,
                    powerOutput: result.power_output,
                };

                setData((prevData) => {
                    const updatedData = [...prevData, newDataPoint];
                    return updatedData.slice(-50);
                });
            } else {
                console.error("Failed to fetch data from backend. Status:", response.status);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="app-container">
            <h1 className="title">Real-Time IoT Data</h1>
            <div className="chart-container">
                <ResponsiveContainer width="97%" height={400}>
                    <LineChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="sunlight" 
                            stroke="#8884d8" 
                            name="Sunlight (%)" 
                            dot={false}
                            animationDuration={100} 
                        />
                        <Line 
                            type="monotone" 
                            dataKey="humidity" 
                            stroke="#82ca9d" 
                            name="Humidity (%)" 
                            dot={false}
                            animationDuration={100}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="powerOutput" 
                            stroke="#ff7300" 
                            name="Power Output (kW)" 
                            dot={false}
                            animationDuration={100}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default App;
