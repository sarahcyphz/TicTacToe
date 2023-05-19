import { useState } from 'react';
import React from 'react';

function Square({ value, onSquareClick, cssW}) {
  return (
    <button className={cssW} onClick={onSquareClick}>{value}</button>
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
    onPlay(nextSquares, i);
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
  function createSquare(position) {
    console.log(position);
    return (
      <Square 
      key={position} 
      value={squares[position]} 
      onSquareClick={() => handleClick(position)} 
      cssW={winner[1].includes(position) ? "square-highlight" : "square"} />  // determine if winning square
    );
  }

  function createBoard() { 
    const boardRows = [];
    for (let i=0; i<3; ++i) {  
      const sqrs = [];
      for (let j=0; j<3; ++j) {
        sqrs.push(createSquare((j * 3)+ i));  //create squares 
      }
      boardRows.push((<div key={i} className="board-row">{sqrs}</div>)); //create rows
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
    const [findLocation, setFindLocation] = useState([Array(9).fill(null)]);  // duplicate history array
    const [currentMove, setCurrentMove] = useState(0);
    const [isAscending, setIsAscending] = useState(true); // default as ascending 
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];
  
    function handlePlay(nextSquares, position) {
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      const nextLocation = [...findLocation.slice(0, currentMove + 1), matchPosition(position)]; 
      setHistory(nextHistory);
      setFindLocation(nextLocation);   
      console.log(findLocation);
      setCurrentMove(nextHistory.length - 1);  // current move
    }
  
    function matchPosition (position) {
      let col = [
        "(1,1)",
        "(1,2)",
        "(1,3)",
        "(2,1)",
        "(2,2)",
        "(2,3)",
        "(3,1)",
        "(3,2)",
        "(3,3)",
      ]
      return col[position];
    }
  
    function jumpTo(nextMove) {
      setCurrentMove(nextMove);
    }
  
    let moves = history.map((squares, move) => {  // const to let so can change map
      let description;
      if (move > 0) {
        let rowcol = findLocation[move];
        description = 'Go to move #' + move + rowcol;
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
      moves.reverse();    // reverse
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
          <ol>{"You are at move " + (currentMove+1)}</ol>
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
