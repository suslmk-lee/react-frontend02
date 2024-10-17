import React from 'react';

const DataTable = ({ data }) => {
    return (
        <div className="right-container">
            <h2>Data Points (Last 7)</h2>
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Sunlight (%)</th>
                        <th>Humidity (%)</th>
                        <th>Power Output (kW)</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((point, index) => (
                        <tr key={index}>
                            <td>{point.time}</td>
                            <td>{point.lightQuantity}</td>
                            <td>{point.humidity}</td>
                            <td>{point.batteryVoltage}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
