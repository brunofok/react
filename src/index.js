import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Peer from 'peerjs'


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
        this.peer = new Peer();
        this.state = {
            squares: Array(9).fill(null),
            freeSquares: 9,
            newId: null,
            opponentsId: null,
            conn: null,
            status: String("Unconnected"),
        };        
    }

    play(player, i, squares){
      squares[i] = player;
      const frSt = this.state.freeSquares - 1;
      this.setState({squares: squares});
      this.state.freeSquares = frSt;
    }

    handleClick(i){
      if (this.state.squares[i] != null)
        return;

      this.state.conn.send(i);

      const squares = this.state.squares.slice();
      if (calculateWinner(squares))
          return;

      if (this.state.freeSquares > 0)
      {        
        this.play('X', i, squares);
      }

      if (this.state.freeSquares > 0){   
        if (calculateWinner(squares))
          return;     

        /*
        var next = 0;
        do{
            next = Math.round(Math.random() * 8);
        }while(squares[next] != null);
        
        this.play('O', next, squares);
        */
      }
    }

    connect()
    {
      const othersId = document.getElementById("opponentsId").value;
      const attemptToConnect = this.peer.connect(othersId);
      const that = this;
      attemptToConnect.on('open', function() {
        that.setState({state: "Connected"});
        console.log("connected");
      });
      this.peer.on('connection', function(conn){
        conn.on('data', function(data){
          console.log('received: ' + data);
          that.handleClick(data);
        });
      });
      this.setState({conn: attemptToConnect});
    } 

    renderSquare(i) {   

        return (
            <Square 
            value={this.state.squares[i]}
            onClick={() => this.handleClick(i)}
            />
        );
    }

    renderConnect() {
      return (
          <button 
          onClick={() => this.connect()}
          />
      );
  }    

  render() {    
    var status = 'Beta player: X against the super powerfull machine O';
    const winner = calculateWinner(this.state.squares)

    /**
     * We need that pointing to this becase in the anonymous function
     * this is different of what we want.
     */
    const that = this;
    that.peer.on("open", function(idr){
      that.setState({newId: idr});
    });      

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
        <div className="connect-button">
          {this.renderConnect()}
        </div>
        <div>Your unique ID is: {this.state.newId}</div>
        <div>Connection's status: {this.state.status}</div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);    
  }

  render() {    
    return (    
      <div className="game">
        
        <p></p>
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">        
          <ol>{/* TODO */}</ol>
        <input id="opponentsId"/>        
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