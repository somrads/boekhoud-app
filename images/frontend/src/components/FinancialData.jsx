import React, { useState, useEffect } from 'react';

const FinancialData = () => {
  const [financialData, setFinancialData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columnComments, setColumnComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    bukrs: '',
    belnr: '',
    gjahr: '',
    blart: '',
    bldat: '',
  });

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

  useEffect(() => {
    // Apply filters to financial data
    setFilteredData(
      financialData.filter(row => {
        return (
          row.bukrs.includes(filters.bukrs) &&
          row.belnr.includes(filters.belnr) &&
          row.gjahr.includes(filters.gjahr) &&
          row.blart.includes(filters.blart) &&
          row.bldat.includes(filters.bldat) 

        );
      })
    );
  }, [financialData, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  return (
    <div>
      <h2>Financial Data</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div>
            <input
              type="text"
              name="bukrs"
              value={filters.bukrs}
              placeholder="BUKRS"
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="belnr"
              value={filters.belnr}
              placeholder="BELNR"
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="gjahr"
              value={filters.gjahr}
              placeholder="GJAHR"
              onChange={handleFilterChange}
            />

              <input
              type="text"
              name="blart"
              value={filters.blart}
              placeholder="BLART"
              onChange={handleFilterChange}
            />
              <input
              type="text"
              name="bldat"
              value={filters.bldat}
              placeholder="BLDAT"
              onChange={handleFilterChange}
            />
          </div>
          <table>
            <thead>
              <tr>
                {Object.keys(columnComments).map((column, index) => (
                  <th key={index}>{columnComments[column]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {Object.keys(row).map((column, index) => (
                    <td key={index}>{row[column]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default FinancialData;
