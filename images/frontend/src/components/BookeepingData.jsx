import React, { useState, useEffect } from 'react';

const BookkeepingData = () => {
  const [bookkeepingData, setBookkeepingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
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
      try {
        // Fetch bookkeeping data
        const bookkeepingResponse = await fetch('http://localhost:80/boekhouding');
        if (!bookkeepingResponse.ok) {
          throw new Error('Network response for bookkeeping data was not ok');
        }
        const data = await bookkeepingResponse.json();
        setBookkeepingData(data);

        // Fetch column comments
        const commentsResponse = await fetch('http://localhost:80/table-comments/boekhouding');
        if (!commentsResponse.ok) {
          throw new Error('Network response for column comments was not ok');
        }
        const comments = await commentsResponse.json();
        const commentsMap = comments.reduce((acc, cur) => {
          acc[cur.column_name] = cur.column_comment;
          return acc;
        }, {});
        setColumnComments(commentsMap);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters to bookkeeping data
    setFilteredData(
      bookkeepingData.filter(row => {
        return (
          row.bukrs.includes(filters.bukrs) &&
          row.belnr.includes(filters.belnr) &&
          row.gjahr.includes(filters.gjahr) &&
          row.buzei.includes(filters.buzei) &&
          row.bschl.includes(filters.bschl) &&
          row.augdt.includes(filters.augdt)
        );
      })
    );
  }, [bookkeepingData, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  return (
    <div>
      <h2>Bookkeeping Data</h2>
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
              name="buzei"
              value={filters.buzei}
              placeholder="BUZEI"
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="bschl"
              value={filters.bschl}
              placeholder="BSCHL"
              onChange={handleFilterChange}
            />
            <input
              type="text"
              name="augdt"
              value={filters.augdt}
              placeholder="AUGDT"
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

export default BookkeepingData;
