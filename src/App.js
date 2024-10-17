import React, { useState, useEffect, useCallback } from 'react';
import LineChartComponent from './components/LineChartComponent';
import AverageChartComponent from './components/AverageChartComponent';
import DataTable from './components/DataTable';
import AverageTable from './components/AverageTable';
import MapComponent from './components/MapComponent';
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
            const response = await fetch(`${API_BASE_URL}/data/recent/30000`);
            if (response.ok) {
                const result = await response.json();
                
                console.log('Fetched Data from Backend:', result); // 데이터를 가져오는지 확인하는 로그

                // 최신 데이터를 사용하여 newDataPoint 생성
                const latestData = result[0]; // 가장 최신 데이터 사용
                const newDataPoint = {
                    time: new Date(latestData.timestamp).toLocaleTimeString(),
                    humidity: latestData.humidity,
                    temperature: latestData.temperature, // 온도 추가
                    lightQuantity: latestData.light_quantity,
                    batteryVoltage: latestData.battery_voltage,
                    solarVoltage: latestData.solar_voltage,
                    loadAmpere: latestData.load_ampere
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
    
        // humidity가 유효한 값인지 확인 후 처리
        const humidityAvg = currentData.reduce((acc, val) => acc + (val.humidity || 0), 0) / currentData.length;
        
        // temperature가 유효한 값인지 확인 후 처리
        const temperatureAvg = currentData.reduce((acc, val) => acc + (val.temperature || 0), 0) / currentData.length;
        
        // lightQuantity가 유효한 값인지 확인 후 처리
        const lightQuantityAvg = currentData.reduce((acc, val) => acc + (val.lightQuantity || 0), 0) / currentData.length;
        const batteryVoltageAvg = currentData.reduce((acc, val) => acc + (val.batteryVoltage || 0), 0) / currentData.length;
        const solarVoltageAvg = currentData.reduce((acc, val) => acc + (val.solarVoltage || 0), 0) / currentData.length;
        const loadAmpereAvg = currentData.reduce((acc, val) => acc + (val.loadAmpere || 0), 0) / currentData.length;

        return {
            time: new Date().toLocaleTimeString().slice(0, 10),
            humidity: humidityAvg || 0, // 값이 없을 경우 0 반환
            temperature: temperatureAvg || 0, // 값이 없을 경우 0 반환
            lightQuantity: lightQuantityAvg || 0, // 값이 없을 경우 0 반환
            batteryVoltage: batteryVoltageAvg || 0,
            solarVoltage: solarVoltageAvg || 0,
            loadAmpere: loadAmpereAvg || 0,
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
            {/* 상단 - 초 단위 그래프와 맵 */}
            <div className="top-content-container">
                <div className="left-section">
                    <LineChartComponent data={graphData} /> {/* 초 단위 실시간 그래프 */}
                </div>
                <div className="right-section">
                    <MapComponent /> {/* 맵 */}
                </div>
            </div>
    
            {/* 중단 - 실시간 테이블 */}
            <div className="table-container">
                <DataTable data={tableData} /> {/* 초 단위 테이블 데이터 */}
            </div>
    
            {/* 하단 - 5초 단위 그래프 및 테이블 */}
            <div className="average-content-container">
                <div className="average-chart-container">
                    <AverageChartComponent averages={averages} /> {/* 5초 단위 평균 그래프 */}
                </div>
                <div className="average-table-container">
                    <AverageTable averages={averages} /> {/* 5초 단위 평균 테이블 */}
                </div>
            </div>
        </div>
    );
    
};

export default App;
