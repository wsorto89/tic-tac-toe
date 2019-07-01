import React from 'react';
import Board from '../board/board';
import { ROW_SIZE, COL_SIZE } from '../../constants/board';
import { DRAW_LENGTH, PLAYER1_START } from '../../constants/game';
import { deepCopy } from '../../helper/deep-copy';

import styles from './game.module.css';

interface GameState {
    history: string[][][];
    isGameOver: boolean;
    isPlayer1Turn: boolean;
    statusMsg: string;
    useTheme: boolean;
};

class TicTacToeGame extends React.Component<{}, GameState> {
    constructor(props: any) {
        super(props);
        this.onResetClick = this.onResetClick.bind(this);
        this.onSquareClick = this.onSquareClick.bind(this);
        this.onThemeChangeClick = this.onThemeChangeClick.bind(this);
        this.onUndoClick = this.onUndoClick.bind(this);

        const values = Array(ROW_SIZE).fill(null).map(() => Array(COL_SIZE).fill(null));
        this.state = {
            history: [values],
            isGameOver: false,
            isPlayer1Turn: true,
            statusMsg: PLAYER1_START,
            useTheme: false
        };
    }

    checkWinner(values: string[][]) {
        let line = '';
        let curRow: Set<string> = new Set();
        let winningRows: Set<string> = new Set();

        // There are only 8 possible ways to win so we will check if any of them have been hit yet
        for(let i = 0; i < 8; i++) {
            switch(i) {
                case 0:
                    line = values[0][0] + values[0][1] + values[0][2];
                    curRow.add('0-0');
                    curRow.add('0-1');
                    curRow.add('0-2');
                    break;
                case 1:
                    line = values[1][0] + values[1][1] + values[1][2];
                    curRow.add('1-0');
                    curRow.add('1-1');
                    curRow.add('1-2');
                    break;
                case 2:
                    line = values[2][0] + values[2][1] + values[2][2];
                    curRow.add('2-0');
                    curRow.add('2-1');
                    curRow.add('2-2');
                    break;
                case 3:
                    line = values[0][0] + values[1][0] + values[2][0];
                    curRow.add('0-0');
                    curRow.add('1-0');
                    curRow.add('2-0');
                    break;
                case 4:
                    line = values[0][1] + values[1][1] + values[2][1];
                    curRow.add('0-1');
                    curRow.add('1-1');
                    curRow.add('2-1');
                    break;
                case 5:
                    line = values[0][2] + values[1][2] + values[2][2];
                    curRow.add('0-2');
                    curRow.add('1-2');
                    curRow.add('2-2');
                    break;
                case 6:
                    line = values[0][0] + values[1][1] + values[2][2];
                    curRow.add('0-0');
                    curRow.add('1-1');
                    curRow.add('2-2');
                    break;
                case 7:
                    line = values[2][0] + values[1][1] + values[0][2];
                    curRow.add('2-0');
                    curRow.add('1-1');
                    curRow.add('0-2');
                    break;
            }
            if (line === 'XXX' || line === 'OOO') {
                curRow.forEach(square => winningRows.add(square));
            } else {
                curRow.clear();
            }
        }

        return winningRows;
    }

    determineIsGameOver(winnerFound: boolean, isFinalMove: boolean) {
        if (winnerFound || isFinalMove) {
            return true;
        }
        return false;
    }

    determineStatusMsg(isPlayer1Turn: boolean, winnerFound: boolean, isFinalMove: boolean) {
        if (winnerFound) {
            if (isPlayer1Turn) {
                return 'Player 1 Wins!!!';
            } else {
                return 'Player 2 Wins!!!';
            }
        } else {
            if (isFinalMove) {
                return 'Draw!';
            }
            return isPlayer1Turn ? 'Player 2 Go!' : 'Player 1 Go!';
        }
    }

    onSquareClick(row: number, col: number) {
        const values = deepCopy(this.state.history[this.state.history.length - 1]);

        // Check to see if square is already used or if game is finished
        if (values[row][col] || this.state.isGameOver) {
            return;
        } else {
            values[row][col] = this.state.isPlayer1Turn ? 'X' : 'O';
            const winningLine = this.checkWinner(values);
            const history = deepCopy(this.state.history);
            history.push(values);

            const winnerFound = winningLine.size > 0;
            const isFinalMove = history.length === DRAW_LENGTH;
            let isGameOver = this.determineIsGameOver(winnerFound, isFinalMove);
            let statusMsg = this.determineStatusMsg(this.state.isPlayer1Turn, winnerFound, isFinalMove);

            this.setState(prevState => ({
                history,
                isGameOver,
                isPlayer1Turn: !prevState.isPlayer1Turn,
                statusMsg
            }));
        }
    }

    onResetClick() {
        const values = Array(ROW_SIZE).fill(null).map(() => Array(COL_SIZE).fill(null));

        this.setState({
            history: [values],
            isGameOver: false,
            isPlayer1Turn: true,
            statusMsg: PLAYER1_START
        });
    }

    onUndoClick() {
        const history = deepCopy(this.state.history);
        history.pop();
        this.setState(prevState => ({
            history,
            isGameOver: false,
            isPlayer1Turn: !prevState.isPlayer1Turn,
            statusMsg: this.determineStatusMsg(prevState.isPlayer1Turn, false, false)
        }));
    }

    onThemeChangeClick() {
        this.setState(prevState => ({
            useTheme: !prevState.useTheme
        }));
    }

    render() {
        const values = this.state.history[this.state.history.length - 1];
        const winningLine = this.checkWinner(values);
        return (
            <div className={styles.game}>
                <h1>Tic Tac Toe</h1>
                <Board
                    onClick={this.onSquareClick}
                    values={values}
                    useTheme={this.state.useTheme}
                    winningLine={winningLine}
                />
                <h3>{this.state.statusMsg}</h3>
                <div className={styles.buttonBar}>
                    <button
                        className={styles.button}
                        disabled={this.state.history.length < 2}
                        onClick={this.onUndoClick}
                    >
                        Undo
                    </button>
                    <button
                        className={styles.button}
                        onClick={this.onResetClick}
                    >
                        Reset
                    </button>
                    <button
                        className={styles.button}
                        onClick={this.onThemeChangeClick}
                    >
                        Theme Change
                    </button>
                </div>
            </div>
        );
    }
}

export default TicTacToeGame;
