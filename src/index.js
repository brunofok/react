import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            freeSquares: 9,
        };        
    }

    handleClick(i){
      if (this.state.squares[i] != null)
        return;

      const squares = this.state.squares.slice();
      if (calculateWinner(squares))
          return;

      if (this.state.freeSquares > 0)
      {        
        squares[i] = 'X';
        this.setState({squares: squares});
        this.state.freeSquares = this.state.freeSquares - 1;        
      }

      if (this.state.freeSquares > 0){   
        if (calculateWinner(squares))
          return;     

        var next = 0;
        do{
            next = Math.round(Math.random() * 8);
        }while(squares[next] != null);
        squares[next] = 'O';
        this.setState({squares: squares});
        this.state.freeSquares = this.state.freeSquares - 1;
      }      
      console.log(i);
      console.log(next);
    }

    renderSquare(i) {
        return (
            <Square 
            value={this.state.squares[i]}
            onClick={() => this.handleClick(i)}
            />
        );
    }

  render() {
    var status = 'Beta player: X against the super powerfull machine O';
    const winner = calculateWinner(this.state.squares)

    if (winner != null)
      status = 'Winner is: ' + winner;

    return (
      <div>
        <div className="status"><b>{status}</b></div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}