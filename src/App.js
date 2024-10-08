import React, { useState, useEffect, useCallback } from 'react';
import LineChartComponent from './components/LineChartComponent';
import AverageChartComponent from './components/AverageChartComponent';
import DataTable from './components/DataTable';
import AverageTable from './components/AverageTable';
import './App.css';

const API_BASE_URL = 'http://localhost:8080';

const App = () => {
    const [graphData, setGraphData] = useState([]); // 그래프용 데이터 (20개 유지)
    const [tableData, setTableData] = useState([]); // 초 단위 테이블용 데이터 (7개 유지)
    const [averages, setAverages] = useState([]);
    const [currentData, setCurrentData] = useState([]); // 평균 계산용 데이터
    const [counter, setCounter] = useState(0); // 5초 카운터

    const fetchData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/data`);
            if (response.ok) {
                const result = await response.json();
                const now = new Date();
                const newDataPoint = {
                    time: now.toLocaleTimeString(),
                    sunlight: result.sunlight,
                    humidity: result.humidity,
                    powerOutput: result.power_output,
                };

                setGraphData((prevData) => [...prevData, newDataPoint].slice(-20));
                setTableData((prevData) => [...prevData, newDataPoint].slice(-7));
                setCurrentData((prevData) => [...prevData, newDataPoint].slice(-5));
                setCounter((prevCounter) => prevCounter + 1);
            } else {
                console.error("Failed to fetch data from backend. Status:", response.status);
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const calculateAverage = useCallback(() => {
        if (currentData.length === 0) return null;

        const sunlightAvg = currentData.reduce((acc, val) => acc + val.sunlight, 0) / currentData.length;
        const humidityAvg = currentData.reduce((acc, val) => acc + val.humidity, 0) / currentData.length;
        const powerOutputAvg = currentData.reduce((acc, val) => acc + val.powerOutput, 0) / currentData.length;

        return {
            time: new Date().toLocaleTimeString().slice(0, 10),
            sunlight: sunlightAvg.toFixed(2),
            humidity: humidityAvg.toFixed(2),
            powerOutput: powerOutputAvg.toFixed(2),
        };
    }, [currentData]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (counter === 5) { // 5초마다 평균 계산
            const newAverage = calculateAverage();
            if (newAverage) {
                setAverages((prevAverages) => [...prevAverages, newAverage].slice(-5));
                setCounter(0);
            }
        }
    }, [counter, calculateAverage]);

    return (
        <div className="main-container">
            <h1 className="title">Real-Time IoT Data</h1>
            <div className="content-container">
                <LineChartComponent data={graphData} />
                <DataTable data={tableData} />
            </div>
            <div className="average-content-container">
                <AverageChartComponent averages={averages} />
                <AverageTable averages={averages} />
            </div>
        </div>
    );
};

export default App;
