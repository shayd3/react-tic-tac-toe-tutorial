import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
class Board extends React.Component {
    renderSquare(i, col, row) {
        return (
            <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                col={col}
                row={row}
            />
        );
    }

    render() {
        return (
            <div>
                <div className='board-row'>
                    {this.renderSquare(0, 0, 0)}
                    {this.renderSquare(1, 1, 0)}
                    {this.renderSquare(2, 2, 0)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(3, 0, 1)}
                    {this.renderSquare(4, 1, 1)}
                    {this.renderSquare(5, 2, 1)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(6, 0, 2)}
                    {this.renderSquare(7, 1, 2)}
                    {this.renderSquare(8, 2, 2)}
                </div>
            </div>
        );
    }
}

function Square(props) {
    return (
        <button
            className='square'
            onClick={props.onClick}
            col={props.col}
            row={props.row}
        >
            {props.value}
        </button>
    );
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        const locations = [
            [1, 1],
            [2, 1],
            [3, 1],
            [1, 2],
            [2, 2],
            [3, 2],
            [1, 3],
            [2, 3],
            [3, 3]
        ];
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        console.log(current.squares);
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        console.log(squares);
        this.setState({
            history: history.concat([{
                squares: squares,
                location: locations[i]
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + " @ " + history[move].location :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            )
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        
        return (
            <div className='game'>
                <div className='game-board'>
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className='game-info'>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
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
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);