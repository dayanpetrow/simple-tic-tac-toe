import React, { Component } from "react";

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
        scores: [0,0,0],
        names: ['Player One', 'Player Two'],
        move: 0,
        turn: Boolean(Math.round(Math.random())),
        board: [["-", "-", "-"], ["-", "-", "-"], ["-", "-", "-"]],
        error: '',
        finished: false,
        status: ''
    };
    this.makeMove = this.makeMove.bind(this);
  }

  makeMove(ri, bi) {
    let { board, turn, move, finished } = this.state;
    

    if(finished) return;

    if(board[ri][bi] !== '-') {
        this.setState({ error: 'Invalid move' });
        return;
    }

    turn ? board[ri][bi] = 'X' : board[ri][bi] = 'O';
    this.setState({ move: move + 1, turn: !turn, board: board, error: '' });

    let [found_winner, who] = this.checkForWinner();
    if(found_winner) {
        let [red, green, draws] = this.state.scores;
        if(who === 'X') {
            red++;
            this.setState({ status: 'Reds won the game!',
                scores: [red,green,draws], finished: true });
            return;
        } else if (who === 'O') {
            green++;
            this.setState({ status: 'Greens won the game!',
                scores: [red,green,draws], finished: true });
            return;
        }
    }

    if(move === 8) {
        let [red, green, draws] = this.state.scores
        draws++;
        this.setState({ status: 'Draw!',
                scores: [red,green,draws], finished: true });
        return;
    } 
  }

  checkForWinner() {
    let { board } = this.state;
    let first;
    for(let i = 0, j = 0; i < 3; i++, j++) {
        first = board[i][0];
        if(first !== '-' && board[i][1] === first && board[i][2] === first) {
            return [true, first];
        }
        first = board[0][j];
        if(first !== '-' && board[1][j] === first && board[2][j] === first) {
            return [true, first];
        }
    }
    first = board[0][0];
    if(first !== '-' && board[1][1] === first && board[2][2] === first) {
        return [true, first];
    }
    first = board[0][2];
    if(first !== '-' && board[1][1] === first && board[2][0] === first) {
        return [true, first];
    }
    return [false, '-'];
  }

  restart() {
    let { turn } = this.state;
    this.setState({
        turn: !turn,
        move: 0,
        board: [["-", "-", "-"], ["-", "-", "-"], ["-", "-", "-"]],
        error: '',
        finished: false,
        status: ''
    });
  }

  render() {
    let { board, turn, names, scores, error, finished, status } = this.state;
    let keys = 0;

    return (
        <div className="flex-container">

            {!finished &&
                <div className="turn">
                    Turn: { turn ? 'Reds' : 'Greens'}
                </div>
            }

            {finished && status !== '' &&
                <div className="winner">
                   {status}
                </div>
            }

            {error !== '' &&
                <div className="errors">
                    { error }
                </div>
            }

            <div className="board">
                { board.map((row, ri) => {
                    return (
                    <div className="row" key={ri}>
                        { row.map((box, bi) => {
                            let playerClass = board[ri][bi] === 'X' ? 'red' : 'green'; //eslint-disable-next-line
                            board[ri][bi] === '-' ? playerClass = 'empty' : playerClass; 
                            return <button className={'box '+ playerClass} key={keys++} onClick={() => this.makeMove(ri, bi)}>{ board[ri][bi] }</button>
                        })
                    }
                    </div>
                    )
                })
                }  
            </div>

            <div className="stats">
                <div className="result">
                    <div>{names[0]}: {scores[0]}</div>
                    <div>{names[1]}: {scores[1]}</div>
                    <div>Draws: {scores[2]}</div>
                </div>

                <button className="newgame" onClick={() => this.restart()}>{finished ? 'New Game' : 'Restart Game' }</button> 
            </div>
        </div>
    )
  }
}

export default Board;
