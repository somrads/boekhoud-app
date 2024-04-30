import React, { useState, useEffect } from 'react';

const FinancialTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:80/financiele-boekhouding');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Financial Table</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Bukrs</th>
              <th>Belnr</th>
              <th>Gjahr</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.belnr}>
                <td>{row.bukrs}</td>
                <td>{row.belnr}</td>
                <td>{row.gjahr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FinancialTable;
