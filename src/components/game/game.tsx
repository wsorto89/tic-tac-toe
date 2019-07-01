import React, { useState } from 'react';
import Board from '../board/board';
import { ROW_SIZE, COL_SIZE } from '../../constants/board';
import { DRAW_LENGTH, PLAYER1_START } from '../../constants/game';
import { deepCopy } from '../../helper/deep-copy';

import styles from './game.module.css';

export default function TicTacToeGame() {
    const initialValues = Array(ROW_SIZE).fill(null).map(() => Array(COL_SIZE).fill(null));
    const [history, setHistory] = useState([initialValues]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isPlayer1Turn, setIsPlayer1Turn] = useState(true);
    const [statusMsg, setStatusMsg] = useState(PLAYER1_START);
    const [isThemeOn, setIsThemeOn] = useState(false);

    const onResetClick = () => {
        const values = Array(ROW_SIZE).fill(null).map(() => Array(COL_SIZE).fill(null));

        setHistory([values]);
        setIsGameOver(false);
        setIsPlayer1Turn(true);
        setStatusMsg(PLAYER1_START);
    }

    const onSquareClick = (row: number, col: number) => {
        const values = deepCopy(history[history.length - 1]);

        // Check to see if square is already used or if game is finished
        if (values[row][col] || isGameOver) {
            return;
        } else {
            values[row][col] = isPlayer1Turn ? 'X' : 'O';
            const winningLine = checkWinner(values);
            const newHistory = deepCopy(history);
            newHistory.push(values);

            const winnerFound = winningLine.size > 0;
            const isFinalMove = newHistory.length === DRAW_LENGTH;
            let isGameOver = determineIsGameOver(winnerFound, isFinalMove);
            let statusMsg = determineStatusMsg(isPlayer1Turn, winnerFound, isFinalMove);
            
            setHistory(newHistory);
            setIsGameOver(isGameOver);
            setIsPlayer1Turn(!isPlayer1Turn);
            setStatusMsg(statusMsg);
        }
    }

    const onUndoClick = () => {
        const newHistory = deepCopy(history);
        newHistory.pop();

        setHistory(newHistory);
        setIsGameOver(false);
        setIsPlayer1Turn(!isPlayer1Turn);
        setStatusMsg(determineStatusMsg(isPlayer1Turn, false, false));
    }

    const onThemeChangeClick = () => {
        setIsThemeOn(!isThemeOn);
    }

    const values = history[history.length - 1];
    const winningLine = checkWinner(values);
    return (
        <div className={styles.game}>
            <h1>Tic Tac Toe</h1>
            <Board
                onClick={onSquareClick}
                values={values}
                isThemeOn={isThemeOn}
                winningLine={winningLine}
            />
            <h3>{statusMsg}</h3>
            <div className={styles.buttonBar}>
                <button
                    className={styles.button}
                    disabled={history.length < 2}
                    onClick={onUndoClick}
                >
                    Undo
                </button>
                <button
                    className={styles.button}
                    onClick={onResetClick}
                >
                    Reset
                </button>
                <button
                    className={styles.button}
                    onClick={onThemeChangeClick}
                >
                    Theme Change
                </button>
            </div>
        </div>
    );
}

function checkWinner(values: string[][]) {
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

function determineIsGameOver(winnerFound: boolean, isFinalMove: boolean) {
    if (winnerFound || isFinalMove) {
        return true;
    }
    return false;
}

function determineStatusMsg(isPlayer1Turn: boolean, winnerFound: boolean, isFinalMove: boolean) {
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
