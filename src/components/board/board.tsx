import React from 'react';
import { ROW_SIZE, COL_SIZE } from '../../constants/board';
import Square from './square';

import styles from './board.module.css';

interface BoardProps {
    onClick: (row: number, col: number) => void;
    isThemeOn: boolean;
    values: string[][];
    winningLine: Set<string>;
}

export default function Board(props: BoardProps) {
    return (
        <div className={styles.table}>
            {renderBoard(ROW_SIZE, COL_SIZE, props)}
        </div>
    );
}

function isAWinnerSquare(winningLine: Set<string>, row: number, col: number) {
    return winningLine.has(`${row}-${col}`);
}

function renderBoard(row: number, col: number, props: BoardProps) {
    const board = [];
    for (let i = 0; i < row; i++) {
        const row = [];
        for (let j = 0; j < col; j++) {
            row.push(renderSquare(i, j, props));
        }
        board.push(<div className={styles.tr} key={i}>{row}</div>);
    }

    return board;
}

function renderSquare(row: number, col: number, props: BoardProps) {
    return (
        <Square
            col={col}
            key={`${row}-${col}`}
            isAWinnerSquare={isAWinnerSquare(props.winningLine, row, col)}
            onClick={props.onClick}
            row={row}
            isThemeOn={props.isThemeOn}
            value={props.values[row][col]}
        />
    )
}
