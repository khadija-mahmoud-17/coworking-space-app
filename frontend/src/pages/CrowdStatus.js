import React, { useState, useEffect } from 'react';

function CrowdStatus() {
  const [data, setData] = useState({
    people_inside: 0,
    status: '',
    color: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/crowd-status');
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching crowd data:', error);
      }
    };

    fetchData(); // initial call
    const interval = setInterval(fetchData, 5000); // every 5 seconds

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Crowd Status</h2>
      <p>People inside: <strong>{data.people_inside}</strong></p>
      <p style={{ color: data.color }}>
        Status: <strong>{data.status}</strong>
      </p>
    </div>
  );
}

export default CrowdStatus;
