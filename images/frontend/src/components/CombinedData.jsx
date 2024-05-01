import React, { useState, useEffect } from 'react';
import "../App.css"
import Logo from "../logo.jpg"

const CombinedData = () => {
  const [financialData, setFinancialData] = useState([]);
  const [bookkeepingData, setBookkeepingData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [columnComments, setColumnComments] = useState({});
  const [loading, setLoading] = useState(true);
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

        const allComments = { ...convertComments(financialColumnComments), ...convertComments(bookkeepingColumnComments) };
        setColumnComments(allComments);
        // Reset filters based on fetched column comments
        setFilters(Object.keys(allComments).reduce((acc, key) => ({ ...acc, [key]: '' }), {}));

        setFinancialData(financialData);
        setBookkeepingData(bookkeepingData);

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

  const convertComments = (comments) => comments.reduce((acc, { column_name, column_comment }) => ({
    ...acc,
    [column_name]: column_comment
  }), {});

  const [expandedRecords, setExpandedRecords] = useState({});

  const toggleRecordExpansion = (index) => {
    setExpandedRecords(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const renderRecord = (row, index) => {
    const isExpanded = !!expandedRecords[index];
    const keys = Object.keys(row);
    return (
      <React.Fragment key={index}>
        <tr>
          {keys.slice(0, 3).map((key, colIndex) => (
            <td key={colIndex}>{row[key]}</td>
          ))}
          <td>
            <button onClick={() => toggleRecordExpansion(index)}>{isExpanded ? 'Hide' : 'See More'}</button>
          </td>
        </tr>
        {isExpanded && (
          <tr>
            <td colSpan="4">
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

  const filteredData = combinedData.filter(row => {
    return Object.entries(filters).every(([key, value]) => value === '' || (row[key] && row[key].includes(value)));
  });

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
            <div className="input">
              <label>
                {columnComments['bukrs'] || 'BUKRS'}
                <input
                  type="text"
                  name="bukrs"
                  value={filters['bukrs']}
                  onChange={handleFilterChange}
                />
              </label>
            </div>
            <div className="input">
              <label>
                {columnComments['gjahr'] || 'GJAHR'}
                <input
                  type="text"
                  name="gjahr"
                  value={filters['gjahr']}
                  onChange={handleFilterChange}
                />
              </label>
            </div>
            <div className="input">
              <label>
                {columnComments['belnr'] || 'BELNR'}
                <input
                  type="text"
                  name="belnr"
                  value={filters['belnr']}
                  onChange={handleFilterChange}
                />
              </label>
            </div>
            <div className="input">
              <label>
                {columnComments['blart'] || 'BLART'}
                <input
                  type="text"
                  name="blart"
                  value={filters['blart']}
                  onChange={handleFilterChange}
                />
              </label>
            </div>
            <div className="input">
              <label>
                {columnComments['bldat'] || 'BLDAT'}
                <input
                  type="text"
                  name="bldat"
                  value={filters['bldat']}
                  onChange={handleFilterChange}
                />
              </label>
            </div>
            <div className="input">
              <label>
                {columnComments['buzei'] || 'BUZEI'}
                <input
                  type="text"
                  name="buzei"
                  value={filters['buzei']}
                  onChange={handleFilterChange}
                />
              </label>
            </div>
            <div className="input">
              <label>
                {columnComments['bschl'] || 'BSCHL'}
                <input
                  type="text"
                  name="bschl"
                  value={filters['bschl']}
                  onChange={handleFilterChange}
                />
              </label>
            </div>
            <div className="input">
              <label>
                {columnComments['augdt'] || 'AUGDT'}
                <input
                  type="text"
                  name="augdt"
                  value={filters['augdt']}
                  onChange={handleFilterChange}
                />
              </label>
            </div>
          </div>
          <div>Total Records: {combinedData.length}, Filtered: {filteredData.length}</div>
          <table>
            <thead>
              <tr>
                {Object.keys(columnComments).slice(0, 3).map(column => (
                  <th key={column}>{columnComments[column]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => renderRecord(row, index))}
            </tbody>
          </table>
        </>
    
      )}
         </div>
    </div>
  );
};

export default CombinedData;
