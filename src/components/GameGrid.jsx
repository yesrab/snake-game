import React from "react";
import "./GameGrid.css";

const GameGrid = ({ grid, handleClick, handleMouseOver }) => {
  return (
    <div className='game-grid'>
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className='grid-row'>
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`grid-cell ${cell}`}
              onClick={() => handleClick(rowIndex, cellIndex)}
              onMouseOver={() => handleMouseOver(rowIndex, cellIndex)}></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameGrid;
