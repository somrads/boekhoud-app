import React, { useState, useEffect } from 'react';

const BookkeepingData = () => {
  const [bookkeepingData, setBookkeepingData] = useState([]);
  const [columnComments, setColumnComments] = useState({});
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <h2>Bookkeeping Data</h2>
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
            {bookkeepingData.map((row, index) => (
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

export default BookkeepingData;
