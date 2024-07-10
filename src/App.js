import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [symbol, setSymbol] = useState('');
  const [multiplier, setMultiplier] = useState(1);
  const [timespan, setTimespan] = useState('day');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [message, setMessage] = useState('');
  const [optionData, setOptionData] = useState([]);

  const collectData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/collect_data/', {
        symbol,
        multiplier,
        timespan,
        from_date: fromDate,
        to_date: toDate
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error collecting data');
    }
  };

  const fetchData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8000/option_data/?symbol=${symbol}&start_date=${fromDate}&end_date=${toDate}`);
      setOptionData(response.data);
    } catch (error) {
      setMessage('Error fetching data');
    }
  };

  return (
    <div className="App">
      <h1>Big Option Data</h1>
      <form onSubmit={collectData}>
        <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="Symbol" required />
        <input type="number" value={multiplier} onChange={(e) => setMultiplier(e.target.value)} placeholder="Multiplier" required />
        <select value={timespan} onChange={(e) => setTimespan(e.target.value)}>
          <option value="day">Day</option>
          <option value="hour">Hour</option>
          <option value="minute">Minute</option>
        </select>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required />
        <button type="submit">Collect Data</button>
      </form>
      <button onClick={fetchData}>Fetch Data</button>
      <p>{message}</p>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Timestamp</th>
            <th>Volume</th>
            <th>VWAP</th>
            <th>Open</th>
            <th>Close</th>
            <th>High</th>
            <th>Low</th>
            <th>Transactions</th>
          </tr>
        </thead>
        <tbody>
          {optionData.map((data, index) => (
            <tr key={index}>
              <td>{data.symbol}</td>
              <td>{new Date(data.timestamp).toLocaleString()}</td>
              <td>{data.volume}</td>
              <td>{data.vwap}</td>
              <td>{data.open}</td>
              <td>{data.close}</td>
              <td>{data.high}</td>
              <td>{data.low}</td>
              <td>{data.transactions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
