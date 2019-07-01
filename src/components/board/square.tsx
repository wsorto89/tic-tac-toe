import React from 'react';

import OSVG from '../../images/o.svg';
import XSVG from '../../images/x.svg';

import styles from './board.module.css';

interface SquareProps {
    col: number;
    isAWinnerSquare: boolean;
    onClick: (row: number, col: number) => void;
    row: number;
    useTheme: boolean;
    value: string | null;
}

class Square extends React.Component<SquareProps> {
    constructor(props: SquareProps) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick() {
        this.props.onClick(this.props.row, this.props.col)
    }

    renderSVG() {
        if (this.props.value === 'X') {
            return (
                <img
                    alt={'X'}
                    className={styles.svgImage}
                    src={XSVG}
                />
            );
        } else if (this.props.value === 'O') {
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

    render() {
        return (
            <div
                className={
                    this.props.isAWinnerSquare
                    ? styles.winner + ' ' + styles.td
                    : styles.td
                }
                onClick={this.handleClick}
            >
                {
                    this.props.useTheme
                    ? this.renderSVG()
                    : this.props.value
                }
            </div>
        );
    }
}

export default Square;
