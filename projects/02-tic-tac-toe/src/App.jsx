import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Square } from './components/Square';
import { TURNS } from './constants';
import { checkWinnerFrom, checkEndGame } from './logic/board';
import { WinnerModal } from './components/WinnerModal';
import { resetGameStorage, saveGameToStorage } from './logic/storage';

import './App.css';

function App() {
    const [board, setBoard] = useState(() => {
        const boardFromStorage = window.localStorage.getItem('board');
        return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null);
    });

    const [turn, setTurn] = useState(() => {
        const turnFromStorage = window.localStorage.getItem('turn');
        return turnFromStorage ?? TURNS.X;
    });

    //null es que no hay ganador, false es que hay un empate
    const [winner, setWinner] = useState(null);

    const updateBoard = (index) => {
        //No actualizacmos esta posicion si ya tiene algo
        if (board[index] || winner) return;

        //Actualizar el tablrero
        const newBoard = [...board];
        newBoard[index] = turn;
        setBoard(newBoard);

        //Cambiar el turno
        const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
        setTurn(newTurn);

        //Guardar partida
        saveGameToStorage({
            board: newBoard,
            turn: newTurn,
        });

        //Revisar si hay un ganador
        const newWinner = checkWinnerFrom(newBoard);
        if (newWinner) {
            confetti();
            setWinner(newWinner);
        } else if (checkEndGame(newBoard)) {
            setWinner(false); //Empate
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setTurn(TURNS.X);
        setWinner(null);

        //Limpiar localStorage
        resetGameStorage();
    };

    return (
        <main className="board">
            <h1>Tic Tac Toe</h1>
            <button onClick={resetGame}> Reinicar Juego</button>
            <section className="game">
                {board.map((square, index) => {
                    return (
                        <Square key={index} index={index} updateBoard={updateBoard}>
                            {square}
                        </Square>
                    );
                })}
            </section>

            <section className="turn">
                <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
                <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
            </section>

            <WinnerModal winner={winner} resetGame={resetGame} />
        </main>
    );
}

export default App;
