import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {

  render() {
    return (
      <button 
        className="square" 
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
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

      if (this.state.freeSquares > 0)
      {        
        squares[i] = 'X';
        this.setState({squares: squares});
        this.state.freeSquares = this.state.freeSquares - 1;
      }

      if (this.state.freeSquares > 0){        
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
    const status = 'Beta player: Herr Ludwigs';

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
