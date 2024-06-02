import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { astar } from './Helper';

const goalState = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null];

const Puzzle = () => {
  const [tiles, setTiles] = useState([]);
  const [solvable, setSolvable] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [overlayText, setOverlayText] = useState(null);
  const timerRef = useRef(null);

// This initialize the puzzle board
  useEffect(() => {
    initializeTiles();
    return () => clearInterval(timerRef.current);
  }, []);

// For Timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

// For initializing the puzzle in solvable order
  const initializeTiles = () => {
    let newTiles = Array.from({ length: 15 }, (_, i) => i + 1).concat(null);
    shuffleTiles(newTiles);
    setMoves(0);
    setTime(0);
  };

// For Shuffling the puzzle randomly and checking is it solvable or not
  const shuffleTiles = (newTiles) => {
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }
    setTiles(newTiles);
    setSolvable(checkSolvable(newTiles)); // This function call will check if it is solvable or not
    setOverlayText('Play');
  };

// Function to check is it solvable
  const checkSolvable = (tiles) => {
    let inversions = 0;
    for (let i = 0; i < tiles.length; i++) {
      for (let j = i + 1; j < tiles.length; j++) {
        if (tiles[i] && tiles[j] && tiles[i] > tiles[j]) {
          inversions++;
        }
      }
    }
    const emptyRowFromBottom = 4 - Math.floor(tiles.indexOf(null) / 4);
    return (inversions + emptyRowFromBottom) % 2 === 0;
  };

// For Movement of tiles
  const moveTile = (index) => {
    const emptyIndex = tiles.indexOf(null);
    const [emptyRow, emptyCol] = [Math.floor(emptyIndex / 4), emptyIndex % 4];
    const [tileRow, tileCol] = [Math.floor(index / 4), index % 4];

    if (
      (tileRow === emptyRow && Math.abs(tileCol - emptyCol) === 1) ||
      (tileCol === emptyCol && Math.abs(tileRow - emptyRow) === 1)
    ) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves((prevMoves) => prevMoves + 1);
      if (checkWin(newTiles)) {
        setIsRunning(false);
        setOverlayText('YOU WON!');
      }
    }
  };

// To Check if the current tile configuration matches the goal state
  const checkWin = (tiles) => {
    for (let i = 0; i < goalState.length; i++) {
      if (tiles[i] !== goalState[i]) {
        return false;
      }
    }
    return true;
  };

// Help function to automate one move towards the solution
  const helpMe = () => {
    const solution = astar(tiles, goalState);
    if (solution && solution.length > 0) {
      const nextMove = solution[0];
      const emptyIndex = tiles.indexOf(null);
      const nextMoveIndex = nextMove.indexOf(null);
      moveTile(nextMoveIndex === emptyIndex - 1 ? emptyIndex - 1 :
               nextMoveIndex === emptyIndex + 1 ? emptyIndex + 1 :
               nextMoveIndex === emptyIndex - 4 ? emptyIndex - 4 :
               emptyIndex + 4);
    }
  };
// For the Overlay Window between play and pause state 
  const toggleStartPause = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
    setOverlayText(!isRunning ? 'PLAY' : 'PAUSED');
  };

  return (
    <div className="puzzle-container">     
      <div className="controls">
        <div>
       <div style={{display: "flex", alignContent: "center"}}>
        <div className="moves">Moves <br/>{moves}</div>
        <div className="time">Time <br/>{time}s</div>
        </div>
        <button onClick={toggleStartPause} className='button button1'>{isRunning ? 'Pause' : 'Start'}</button>
        </div>
        <h1 style={{fontFamily:"bradley hand,cursive", fontSize: "35px", fontWeight:"normal", marginLeft : "35px"}}>FIFTEEN PUZZLE <br/>GAME</h1>
      </div>
      <div className="box">
      <div className="grid">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={`tile ${tile === null ? 'empty' : ''}`}
            onClick={() => moveTile(index)}
          >
            {tile}
          </div>
        ))}
      </div>
      {overlayText && (
        <div className="overlay" onClick={() => setOverlayText(null)}>
          {overlayText}
        </div>
      )}
      </div>
      <div>
        <button onClick={initializeTiles} className='button2'>Shuffle</button>
        <button onClick={helpMe} disabled={solvable} className='button2'>Help me</button>
      </div>
      {solvable && <p>Not solvable</p>}
      <div style={{textAlign: "left", fontFamily: "cursive", fontWeight: "lighter" }}>
        <h1 style={{fontFamily: "bradley hand,cursive", fontSize: "35px", fontWeight: "lighter" }}>Instructions -</h1>
        <p>Move tiles in grid to order them from 1 to 15. To move a tile you can click on it.</p>
        <p>You can use Help Me button to get the hint for next step. </p>
        <br/>
        
  </div> 
        <a href='#'>Designed By- Aditya Shivhare</a>
    </div>
  );
};

export default Puzzle;
