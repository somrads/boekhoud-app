// Importing React and necessary hooks, styles, and assets
import React, { useState, useEffect } from 'react';
import "../App.css";
import Logo from "../logo.jpg";

const CombinedData = () => {
  // State for storing financial and bookkeeping data, and their combined result
  const [financialData, setFinancialData] = useState([]);
  const [bookkeepingData, setBookkeepingData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  // State for storing column comments and loading status
  const [columnComments, setColumnComments] = useState({});
  const [loading, setLoading] = useState(true);
  // State for filter inputs
  const [filters, setFilters] = useState({
    bukrs: '',
    gjahr: '',
    belnr: '',
    blart: '',
    bldat: '',
    buzei: '',
    bschl: '',
    augdt: '',
  });

  // useEffect to fetch data once component mounts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetching financial data
        const financialResponse = await fetch('http://localhost:80/financiele-boekhouding');
        const financialData = await financialResponse.json();
        // Fetching comments for financial data
        const financialCommentsResponse = await fetch('http://localhost:80/table-comments/financiele-boekhouding');
        const financialColumnComments = await financialCommentsResponse.json();

        // Fetching bookkeeping data
        const bookkeepingResponse = await fetch('http://localhost:80/boekhouding');
        const bookkeepingData = await bookkeepingResponse.json();
        // Fetching comments for bookkeeping data
        const bookkeepingCommentsResponse = await fetch('http://localhost:80/table-comments/boekhouding');
        const bookkeepingColumnComments = await bookkeepingCommentsResponse.json();

        // Check for unsuccessful API responses
        if (!financialResponse.ok || !bookkeepingResponse.ok || !financialCommentsResponse.ok || !bookkeepingCommentsResponse.ok) {
          throw new Error('Network response was not ok');
        }

        // Combine column comments from both data sources
        const allComments = { ...convertComments(financialColumnComments), ...convertComments(bookkeepingColumnComments) };
        setColumnComments(allComments);
        // Reset filters to have empty strings for all fields initially
        setFilters(Object.keys(allComments).reduce((acc, key) => ({ ...acc, [key]: '' }), {}));

        // Update state with fetched data
        setFinancialData(financialData);
        setBookkeepingData(bookkeepingData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // useEffect to merge financial and bookkeeping data based on specific conditions
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

  // Function to handle changes in filter inputs
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Function to convert fetched comments into a more accessible format
  const convertComments = (comments) => comments.reduce((acc, { column_name, column_comment }) => ({
    ...acc,
    [column_name]: column_comment
  }), {});

  // State to track which records are expanded in the UI
  const [expandedRecords, setExpandedRecords] = useState({});

  // Function to toggle the expansion of records in the UI
  const toggleRecordExpansion = (index) => {
    setExpandedRecords(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Function to render each record in the table
  const renderRecord = (row, index) => {
    const isExpanded = !!expandedRecords[index];
    const keys = Object.keys(row);
    return (
      <React.Fragment key={index}>
        <tr>
          {keys.slice(0, 3).map((key, colIndex) => (
            <td className="column-long-text" key={colIndex}>{row[key]}</td>
          ))}
          <td>
            <button onClick={() => toggleRecordExpansion(index)}>{isExpanded ? 'Hide' : 'See More'}</button>
          </td>
        </tr>
        {isExpanded && (
          <tr>
            <td className="column-long-text" colSpan="4">
              <table>
                <thead>
                  <tr>
                    {keys.slice(3).map((key, colIndex) => (
                      <th key={colIndex}>{columnComments[key]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {keys.slice(3).map((key, colIndex) => (
                      <td key={colIndex}>{row[key]}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  // Applying filters to the combined data
  const filteredData = combinedData.filter(row => {
    return Object.entries(filters).every(([key, value]) => value === '' || (row[key] && row[key].includes(value)));
  });

  // Component rendering
  return (
    <div>
        <div className="header">
            <img src={Logo} alt='KuLeuvenLogo' />
            <h1>Booky</h1>
        </div>

        <div className="content-wrap">
          <h2>Document Directory</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className='input-wrap'>
                {Object.keys(filters).map((filterKey) => (
                  <div className="input" key={filterKey}>
                    <label>
                      {columnComments[filterKey] || filterKey.toUpperCase()}
                      <input
                        type="text"
                        name={filterKey}
                        value={filters[filterKey]}
                        onChange={handleFilterChange}
                      />
                    </label>
                  </div>
                ))}
              </div>
              <div className='total'>Total Records: {combinedData.length}, Filtered: {filteredData.length}</div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      {Object.keys(columnComments).slice(0, 3).map(column => (
                        <th className='column-long-text' key={column}>{columnComments[column]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, index) => renderRecord(row, index))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
    </div>
  );
};

export default CombinedData;
