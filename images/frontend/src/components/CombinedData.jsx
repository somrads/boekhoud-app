import React, { useState, useEffect } from 'react';

const CombinedData = () => {
  const [financialData, setFinancialData] = useState([]);
  const [bookkeepingData, setBookkeepingData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [columnComments, setColumnComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    bukrs: '',
    belnr: '',
    gjahr: '',
    buzei: '',
    bschl: '',
    augdt: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch financial data and column comments
        const financialResponse = await fetch('http://localhost:80/financiele-boekhouding');
        const financialData = await financialResponse.json();
        const financialCommentsResponse = await fetch('http://localhost:80/table-comments/financiele-boekhouding');
        const financialColumnComments = await financialCommentsResponse.json();

        // Fetch bookkeeping data and column comments
        const bookkeepingResponse = await fetch('http://localhost:80/boekhouding');
        const bookkeepingData = await bookkeepingResponse.json();
        const bookkeepingCommentsResponse = await fetch('http://localhost:80/table-comments/boekhouding');
        const bookkeepingColumnComments = await bookkeepingCommentsResponse.json();

        if (!financialResponse.ok || !bookkeepingResponse.ok || !financialCommentsResponse.ok || !bookkeepingCommentsResponse.ok) {
          throw new Error('Network response was not ok');
        }

        setFinancialData(financialData);
        setBookkeepingData(bookkeepingData);
        setColumnComments({ ...convertComments(financialColumnComments), ...convertComments(bookkeepingColumnComments) });

      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const mergedData = financialData.reduce((acc, finRow) => {
      const match = bookkeepingData.find(bkRow => bkRow.bukrs === finRow.bukrs && bkRow.belnr === finRow.belnr && bkRow.gjahr === finRow.gjahr);
      if (match) {
        acc.push({ ...finRow, ...match });
      }
      return acc;
    }, []);
    setCombinedData(mergedData);
  }, [financialData, bookkeepingData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredData = combinedData.filter(row => {
    return Object.entries(filters).every(([key, value]) => value === '' || (row[key] && row[key].includes(value)));
  });

  const convertComments = (comments) => comments.reduce((acc, { column_name, column_comment }) => ({
    ...acc,
    [column_name]: column_comment
  }), {});

  return (
    <div>
      <h2>Combined Data</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div>
            {Object.keys(filters).map(key => (
              <input
                key={key}
                type="text"
                name={key}
                value={filters[key]}
                placeholder={key.toUpperCase()}
                onChange={handleFilterChange}
              />
            ))}
          </div>
          <table>
            <thead>
              <tr>
                {Object.keys(columnComments).map(column => (
                  <th key={column}>{columnComments[column]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {Object.keys(row).map((key, colIndex) => (
                    <td key={colIndex}>{row[key]}</td>
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

export default CombinedData;
