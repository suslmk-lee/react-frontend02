import React from 'react';

const AverageTable = ({ averages }) => {
    return (
        <div className="average-table-container">
            <h2>5-Second Averages</h2>
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
                    {averages.map((avg, index) => (
                        <tr key={index}>
                            <td>{avg.time}</td>
                            <td>{avg.sunlight}</td>
                            <td>{avg.humidity}</td>
                            <td>{avg.powerOutput}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AverageTable;
