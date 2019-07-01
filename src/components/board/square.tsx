import React from 'react';

import OSVG from '../../images/o.svg';
import XSVG from '../../images/x.svg';

import styles from './board.module.css';

interface SquareProps {
    col: number;
    isAWinnerSquare: boolean;
    onClick: (row: number, col: number) => void;
    row: number;
    isThemeOn: boolean;
    value: string | null;
}

export default function Square(props: SquareProps) {
    const handleClick = () => {
        props.onClick(props.row, props.col);
    }

    return (
        <div
            className={
                props.isAWinnerSquare
                ? styles.winner + ' ' + styles.td
                : styles.td
            }
            onClick={handleClick}
        >
            {
                props.isThemeOn
                ? renderSVG(props.value)
                : props.value
            }
        </div>
    );
}

function renderSVG(value: string | null) {
    if (value === 'X') {
        return (
            <img
                alt={'X'}
                className={styles.svgImage}
                src={XSVG}
            />
        );
    } else if (value === 'O') {
        return (
            <img
                alt={'O'}
                src={OSVG}
            />
        );
    } else {
        return null;
    }
}
