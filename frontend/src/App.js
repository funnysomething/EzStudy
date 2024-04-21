import React, { useState, useEffect, useRef} from 'react';
import axios from 'axios';
import './App.css';
import parse from 'html-react-parser';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [gridSize, setGridSize] = useState({ rows: 0, columns: 0 });
  const [showText, setShowText] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showTypingText, setShowTypingText] = useState(false);
  const textOutputRef = useRef(null);

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
    const threshold = 2200;
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
      const availableWidth = screenWidth
      const availableHeight = screenHeight
      const maxColumns = Math.floor(availableWidth / cellSize);
      const maxRows = Math.floor(availableHeight / cellSize);
      setGridSize({ rows: maxRows, columns: maxColumns });
    }

    handleResize(); // Call it initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); 

  useEffect(() => {
    if (showText && textOutputRef.current) {
      textOutputRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showText]);
  
  const handleDrop = async (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    
    // Create a FormData object to hold the file
    const formData = new FormData();
    files.forEach(file => {
      formData.append('file', file);
    });
    setShowText(true);
    setShowTypingText(true);
    try {
      // Send the file to Flask using Axios or fetch API
      await axios.post('https://ezsum.study/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res =>  {    
      setShowTypingText(false);
      // Simulate typing effect
      const textToType = res.data;
      let currentIndex = 4;
      const typingInterval = 10; // Adjust typing speed
      const typingTimer = setInterval(() => {
          setTypedText(prevTypedText => prevTypedText + textToType[currentIndex]);
          currentIndex++;
          if (currentIndex === textToType.length-9) {
            clearInterval(typingTimer);
          }
        }, typingInterval);
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
    <div className="App">
      <h1 id="Main-text">Drag and Drop Your PDF or PowerPoint!</h1>
      <div className="background" onMouseMove={handleMouseMove} onDrop={handleDrop} onDragOver={handleDragOver}>
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
      {/* Section where text will be outputted */}
      {showText && (
        <div className="text-output-section" id="text-output-section" ref={textOutputRef}>
          {showTypingText && <h5>Output May Take a Second</h5>}
          <div>{parse(typedText)}</div>
        
        </div>
      )}
    </div>
  );
}

export default App;
