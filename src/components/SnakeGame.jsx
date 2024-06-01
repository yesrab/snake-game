import React, { useState, useEffect } from "react";
import GameGrid from "./GameGrid";
import "./GameGrid.css";
const initialGrid = Array.from({ length: 10 }, () => Array(20).fill(""));

const getRandomPosition = () => ({
  x: Math.floor(Math.random() * 10),
  y: Math.floor(Math.random() * 20),
});

const createSnake = () => {
  const startPosition = getRandomPosition();
  const length = Math.floor(Math.random() * 2) + 3; // Length 3 or 4
  const direction = Math.floor(Math.random() * 4); // Random initial direction

  const snake = [];
  for (let i = 0; i < length; i++) {
    snake.push({ x: startPosition.x, y: startPosition.y });
  }

  // Adjust initial positions based on direction
  if (direction === 0) {
    // Up
    for (let i = 0; i < length; i++) {
      snake[i].x =
        startPosition.x - i >= 0 ? startPosition.x - i : startPosition.x;
    }
  } else if (direction === 1) {
    // Down
    for (let i = 0; i < length; i++) {
      snake[i].x =
        startPosition.x + i < 10 ? startPosition.x + i : startPosition.x;
    }
  } else if (direction === 2) {
    // Left
    for (let i = 0; i < length; i++) {
      snake[i].y =
        startPosition.y - i >= 0 ? startPosition.y - i : startPosition.y;
    }
  } else {
    // Right
    for (let i = 0; i < length; i++) {
      snake[i].y =
        startPosition.y + i < 20 ? startPosition.y + i : startPosition.y;
    }
  }

  return snake;
};

const SnakeGame = () => {
  const [grid, setGrid] = useState(initialGrid);
  const [player, setPlayer] = useState(getRandomPosition());
  const [diamond, setDiamond] = useState(getRandomPosition());
  const [snakes, setSnakes] = useState([createSnake()]);
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const updateGrid = () => {
    const newGrid = initialGrid.map((row) => row.slice());
    newGrid[player.x][player.y] = "player";
    newGrid[diamond.x][diamond.y] = "diamond";
    snakes.forEach((snake) => {
      snake.forEach((segment) => {
        newGrid[segment.x][segment.y] = "snake";
      });
    });
    setGrid(newGrid);
  };

  const moveSnakes = () => {
    setSnakes((prevSnakes) =>
      prevSnakes.map((snake) => {
        const newSnake = [...snake];
        const head = newSnake[0];
        const direction = Math.floor(Math.random() * 4); // Random movement direction

        let newHead;
        if (direction === 0 && head.x > 0)
          newHead = { x: head.x - 1, y: head.y }; // up
        else if (direction === 1 && head.x < 9)
          newHead = { x: head.x + 1, y: head.y }; // down
        else if (direction === 2 && head.y > 0)
          newHead = { x: head.x, y: head.y - 1 }; // left
        else if (direction === 3 && head.y < 19)
          newHead = { x: head.x, y: head.y + 1 }; // right
        else return newSnake; // If direction is invalid, don't move

        newSnake.pop(); // Remove the tail
        newSnake.unshift(newHead); // Add new head

        return newSnake;
      })
    );
  };

  const handleClick = (x, y) => {
    if (x === diamond.x && y === diamond.y) {
      setDiamond(getRandomPosition());
      setScore(score + 10);
      setSnakes([...snakes, createSnake()]);
    }
  };

  const handleMouseOver = (x, y) => {
    setPlayer({ x, y });
    snakes.forEach((snake) => {
      snake.forEach((segment) => {
        if (segment.x === x && segment.y === y) {
          if (score > 0 && isRunning) {
            setScore(score - 10);
          }
        }
      });
    });
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        moveSnakes();
        updateGrid();
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isRunning, snakes, player, diamond]);

  return (
    <div className='gameContainer'>
      <div>
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Stop" : "Start"}
        </button>
        <div>Score: {score}</div>
      </div>
      <GameGrid
        grid={grid}
        handleClick={handleClick}
        handleMouseOver={handleMouseOver}
      />
    </div>
  );
};

export default SnakeGame;
