import React, { useState, useEffect } from 'react';

const FinancialData = () => {
  const [financialData, setFinancialData] = useState([]);
  const [columnComments, setColumnComments] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch financial data
        const financialResponse = await fetch('http://localhost:80/financiele-boekhouding');
        if (!financialResponse.ok) {
          throw new Error('Network response for financial data was not ok');
        }
        const financialData = await financialResponse.json();
        setFinancialData(financialData);

        // Fetch column comments
        const commentsResponse = await fetch('http://localhost:80/table-comments/financiele-boekhouding');
        if (!commentsResponse.ok) {
          throw new Error('Network response for column comments was not ok');
        }
        const columnComments = await commentsResponse.json();
        const columnCommentsMap = columnComments.reduce((acc, cur) => {
          acc[cur.column_name] = cur.column_comment;
          return acc;
        }, {});
        setColumnComments(columnCommentsMap);

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
      <h2>Financial Data</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              {Object.keys(columnComments).map((column, index) => (
                <th key={index}>{columnComments[column]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {financialData.map((row, index) => (
              <tr key={index}>
                {Object.keys(row).map((column, index) => (
                  <td key={index}>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FinancialData;
