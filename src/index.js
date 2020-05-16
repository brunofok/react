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
        this.whoAmI = null;
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
      this.setState({squares: squares, freeSquares: frSt});
      this.setState({freeSquares: frSt});
    }

    handleSharedClick(player, i){
      this.handleClick(player, i);
      this.state.conn.send(i);
    }

    handleClick(player, i){
      if (this.state.squares[i] != null)
        return;

      //if (!this.state.conn || !this.state.conn.open)
        //this.connect();

      const squares = this.state.squares.slice();
      if (calculateWinner(squares))
          return;

      if (this.state.freeSquares > 0)
      {        
        this.play(player, i, squares);
      }

      if (this.state.freeSquares > 0){   
        if (calculateWinner(squares))
          return;     
      }
    }

    connect()
    {
      if (this.conn){
        this.conn.close();
      }
      const othersId = document.getElementById("opponentsId").value;
      if (othersId === ""){
        alert("You need to enter the opponent's id.");
        return;
      }
      const attemptToConnect = this.peer.connect(othersId, {reliable: true});
      const that = this;
      attemptToConnect.on('open', function() {
        if (that.whoAmI == null)
          that.whoAmI = 'X';
        that.setState({status: "Connected"});        
        this.on('data', function(data){
          that.handleClick('O', data);
        });
      });
      this.setState({conn: attemptToConnect});
    } 

    renderSquare(i) {   

        return (
            <Square 
            value={this.state.squares[i]}
            onClick={() => this.handleSharedClick(this.whoAmI, i)}
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
    var status = '';
    if (this.whoAmI)
      status = 'Match started. You are the player ' + this.whoAmI;
    
    const winner = calculateWinner(this.state.squares)

    /**
     * We need that pointing to this becase in the anonymous function
     * this is different of what we want.
     */
    const that = this;
    that.peer.on("open", function(idr){
      that.setState({newId: idr});
    });    
    
    that.peer.on("connection", function(c){
      if (that.whoAmI == null)
        that.whoAmI = 'O';
      that.setState({status: "Connected"});
      console.log("someone tried to connect remotely: " + c.peer);
      c.on('data', function(data){
        that.handleClick('X', data);
      });
      that.setState({conn: c});
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