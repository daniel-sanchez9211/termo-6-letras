import Line from "./Line";
import { words } from '../utils/words'
import { useEffect, useState, useRef } from "react"

function Board() {
    const [activeLine, setActiveLine] = useState(0)
    const [selectedSquare, setSelectedSquare] = useState(0)
    const [word, setWord] = useState(words[Math.floor(Math.random() * (Math.floor(words.length) - Math.ceil(1) + 1)) + Math.ceil(1)].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
    const [letters, setLetters] = useState([['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', '']]
    )
    const stateRef = useRef();
    stateRef.current = {
        selectedSquare,
        letters,
        activeLine,
        word
    };
    useEffect(() => {
        console.log(word)
        window.addEventListener("keydown", (event) => {
            if (event.keyCode === 39) {
                nextSquare()
            } else if (event.keyCode === 37) {
                previousSquare()
            } else if (event.keyCode === 13) {
                playWord()
            } else if (event.which) {
                setLetter(event)
            }
        })
    }, [])

    function setLetter(event) {
        const newLetterArray = stateRef.current.letters
        newLetterArray[stateRef.current.activeLine][stateRef.current.selectedSquare] = String.fromCharCode(event.which)
        setLetters(newLetterArray)
        nextSquare()
    }

    function playWord() {
        if (stateRef.current.word === letters[stateRef.current.activeLine].toString().replaceAll(',', '').toLowerCase()) {
            setTimeout(() => {
                alert('Acertou! A palavra é ' + word)
            }, 100);
            return setActiveLine(6) //gambiarra para tirar a interacao da tela (encerrar o jogo)
        }
        if (stateRef.current.word !== letters[stateRef.current.activeLine].toString().replaceAll(',', '').toLowerCase() && stateRef.current.activeLine + 1 > 5) {
            setTimeout(() => {
                alert('Errooooou! A palavra é ' + word)
            }, 100);
        }
        setActiveLine(stateRef.current.activeLine + 1)
    }

    function nextSquare() {
        const ns = stateRef.current.selectedSquare + 1;
        setSelectedSquare(ns > 5 ? 0 : ns)
    }

    function previousSquare() {
        const ns = stateRef.current.selectedSquare - 1;
        setSelectedSquare(ns < 0 ? 5 : ns)
    }

    function handleSquareClick(position) {
        setSelectedSquare(position)
    }


    return (
        <div className="Board">
            <h1>Termo 6 letras!</h1>

            <Line isActive={activeLine === 0} selectedSquare={selectedSquare} letters={letters[0]} activeLine={activeLine} word={word} done={activeLine > 0} handleSquareClick={handleSquareClick} />
            <Line isActive={activeLine === 1} selectedSquare={selectedSquare} letters={letters[1]} activeLine={activeLine} word={word} done={activeLine > 1} handleSquareClick={handleSquareClick} />
            <Line isActive={activeLine === 2} selectedSquare={selectedSquare} letters={letters[2]} activeLine={activeLine} word={word} done={activeLine > 2} handleSquareClick={handleSquareClick} />
            <Line isActive={activeLine === 3} selectedSquare={selectedSquare} letters={letters[3]} activeLine={activeLine} word={word} done={activeLine > 3} handleSquareClick={handleSquareClick} />
            <Line isActive={activeLine === 4} selectedSquare={selectedSquare} letters={letters[4]} activeLine={activeLine} word={word} done={activeLine > 4} handleSquareClick={handleSquareClick} />
            <Line isActive={activeLine === 5} selectedSquare={selectedSquare} letters={letters[5]} activeLine={activeLine} word={word} done={activeLine > 5} handleSquareClick={handleSquareClick} />
        </div>
    );
}

export default Board;
