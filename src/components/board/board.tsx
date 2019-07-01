import React from 'react';
import { ROW_SIZE, COL_SIZE } from '../../constants/board';
import Square from './square';

import styles from './board.module.css';

interface BoardProps {
    onClick: (row: number, col: number) => void;
    useTheme: boolean;
    values: string[][];
    winningLine: Set<string>;
}

class Board extends React.Component<BoardProps> {
    isAWinnerSquare(row: number, col: number) {
        return this.props.winningLine.has(`${row}-${col}`);
    }

    renderBoard(row: number, col: number) {
        const board = [];
        for (let i = 0; i < row; i++) {
            const row = [];
            for (let j = 0; j < col; j++) {
                row.push(this.renderSquare(i, j));
            }
            board.push(<div className={styles.tr} key={i}>{row}</div>);
        }

        return board;
    }

    renderSquare(row: number, col: number) {
        return (
            <Square
                col={col}
                key={`${row}-${col}`}
                isAWinnerSquare={this.isAWinnerSquare(row, col)}
                onClick={this.props.onClick}
                row={row}
                useTheme={this.props.useTheme}
                value={this.props.values[row][col]}
            />
        )
    }

    render() {
        return (
            <div className={styles.table}>
                {this.renderBoard(ROW_SIZE, COL_SIZE)}
            </div>
        );
    }
}

export default Board;
