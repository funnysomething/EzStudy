import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [gridSize, setGridSize] = useState({ rows: 0, columns: 0 });
  const [droppedFiles, setDroppedFiles] = useState([]);

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const calculateDistance = (pointX, pointY) => {
    const dx = mousePosition.x - pointX + 400;
    const dy = mousePosition.y - pointY + 450;
    return Math.sqrt(dx * dx + dy * dy);
  }; 

  const getBackgroundColor = (x, y) => {
    const distance = calculateDistance(x, y);
    const threshold = 1700;
    var red = 0; var green = 247; var blue = 191; 
    if (distance < threshold) {
      const opacity = 1 - distance / threshold;
      return `rgba(50, 168, 139, ${opacity})`;
    }
    return 'transparent';
  };

  useEffect(() => {
    function handleResize() {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const cellSize = 24; // Adjust cell size as needed
      const margin = 10; // Adjust margin size as needed
      const availableWidth = screenWidth// - margin * 2; // Consider margins
      const availableHeight = screenHeight// - margin * 2; // Consider margins
      const maxColumns = Math.floor(availableWidth / cellSize);
      const maxRows = Math.floor(availableHeight / cellSize);
      setGridSize({ rows: maxRows, columns: maxColumns });
    }

    handleResize(); // Call it initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDrop = async (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    
    // Create a FormData object to hold the file
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });
  
    try {
      // Send the file to Flask using Axios or fetch API
      await axios.post('http://your-flask-server-endpoint', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log('File sent successfully.');
    } catch (error) {
      console.error('Error sending file:', error);
    }
  };
  

  const handleDragOver = (event) => {
    event.preventDefault();
  }; 

  return (
    <div className="App" onMouseMove={handleMouseMove} onDrop={handleDrop} onDragOver={handleDragOver}>
      <h1>Drag and Drop Your File!</h1>
      <div className="background">
        {Array.from({ length: gridSize.rows }, (_, rowIndex) => (
          <div key={rowIndex} className="row">
            {Array.from({ length: gridSize.columns }, (_, colIndex) => (
              <div
                key={colIndex}
                className="cell"
                style={{ backgroundColor: getBackgroundColor(colIndex * 50, rowIndex * 50) }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
