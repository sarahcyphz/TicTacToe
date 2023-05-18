import { useState } from 'react';
import React from 'react';

function Square({ value, onSquareClick, cssC}) {
  return (
    <button className={cssC} onClick={onSquareClick}>{value}</button>
  );
}

function Board({ xIsNext, squares, onPlay}) {
  function handleClick(i) {

    if (calculateWinner(squares)[0].length > 0 || squares[i] ) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  let draw = true;                               
  for (let j = 0; j < squares.length; j++) {  // determine if all sqrs are full
    if (squares[j] === null) {
      draw = false;
    }
  }

  let status;
  if (winner[0].length > 0 ) {
    status = 'Winner: ' + winner[0];
  } else if (draw) {
    status = 'Draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  } 
 
  // create square button
  function createSquare(i) {
    return (
      <Square key={i} value={squares[i]} onSquareClick={() => handleClick(i)} cssC={winner[1].includes(i) ? "square-highlight" : "square"  } />
    );
  }

  function createBoard() { 
    const boardRows = [];
    for (let i=0; i<3; ++i) {  // create rows
      const rows = [];
      for (let j=0; j<3; ++j) {
        rows.push(createSquare((j * 3)+ i));  //create squares
      }
      boardRows.push((<div key={i} className="board-row">{rows}</div>));
    }

    return (
      <div>{boardRows}</div>
    );
  }

    return (
      <div>
        <div className="status">{status}</div>
        {createBoard()}
      </div>
    );
  }

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);  
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true); // default as ascending (True)
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  console.log(history);
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  let moves = history.map((squares, move) => {  // const to let so can change map
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}> {description} </button>
      </li>
    ); 
  });

  function toggleHistory() {
    setIsAscending(!isAscending); // change boolean 
  }

  if(!isAscending) {
    moves.reverse();    // if false, reverse
  }

  return (
    < div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={() => toggleHistory()}>
          {isAscending ? 'Sort by descending' : 'Sort by ascending' }  
        </button>
        <ol>{moves}</ol>
        <ol>{"You are at move " + history.length}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for ( let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]]
    }
    }
  return ['', []];
  }
