import Line from "./Line";
import SimpleKeyboard from "./SimpleKeyboard"
import { words } from '../utils/words'
import { allWordsArr } from '../utils/allWordsArr'
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
    const [greyLetters, setGreyLetters] = useState(["}"]) 
    const [yellowLetters, setYellowLetters] = useState(["}"]) 
    const [greenLetters, setGreenLetters] = useState(["}"]) 
    const stateRef = useRef();
    stateRef.current = {
        selectedSquare,
        letters,
        activeLine,
        word,
        greenLetters,
        greyLetters,
        yellowLetters,
    };
    useEffect(() => {
        window.addEventListener("keydown", (event) => {
            if (event.keyCode === 39) {
                nextSquare()
            } else if (event.keyCode === 37) {
                previousSquare()
            } else if (event.keyCode === 13) {
                playWord()
            } else if (event.keyCode === 8) {
                eraseLetter()
            } else if (String.fromCharCode(event.which).match(/[a-zA-Z]/g)) {
                setLetter(String.fromCharCode(event.which))
            }
        })
    }, [])

    function setLetter(value) {
        const newLetterArray = stateRef.current.letters
        newLetterArray[stateRef.current.activeLine][stateRef.current.selectedSquare] = value
        setLetters([...newLetterArray])
        nextSquare()
    }

    function eraseLetter() {
        if (stateRef.current.selectedSquare > 0) {
            const newLetterArray = stateRef.current.letters
            const isEmpty = newLetterArray[stateRef.current.activeLine][stateRef.current.selectedSquare] === ''
            const squareToErase = isEmpty ? stateRef.current.selectedSquare - 1 : stateRef.current.selectedSquare
            newLetterArray[stateRef.current.activeLine][squareToErase] = ''
            setLetters([...newLetterArray])
            if (isEmpty) {
                previousSquare()
            }
        }
    }

    function playWord() {
        let allFilled = true

        letters[stateRef.current.activeLine].forEach(l => {
            if (!l) allFilled = false
        })

        if (!allFilled) return
        if (allWordsArr.indexOf(letters[stateRef.current.activeLine].toString().replaceAll(',', '').toLowerCase()) === -1) return

        const newGreenLettersArr = [...stateRef.current.greenLetters]
        const newYelloLettersArr = [...stateRef.current.yellowLetters]
        const newGreyLettersArr = [...stateRef.current.greyLetters]

        letters[stateRef.current.activeLine].forEach((l,i) => {
            if(l.toLowerCase() === stateRef.current.word.charAt(i)) {
                newGreenLettersArr.push(l.toLowerCase())
            } else if (l && l.toLowerCase() !== stateRef.current.word.charAt(i) && stateRef.current.word.includes(l.toLowerCase()) ) {
                newYelloLettersArr.push(l.toLowerCase())
            } else if (l && !stateRef.current.word.includes(l.toLowerCase())) {
                newGreyLettersArr.push(l.toLowerCase())
            }            
        })

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
        setSelectedSquare(0)
        console.log(newGreyLettersArr)
        setGreenLetters([...newGreenLettersArr])
        setYellowLetters([...newYelloLettersArr])
        setGreyLetters([...newGreyLettersArr])
    }

    function nextSquare() {
        const ns = stateRef.current.selectedSquare + 1;
        if (ns < 6) setSelectedSquare(ns)
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

            {letters.map((l, i) => {
                return <Line key={i} isActive={activeLine === i} selectedSquare={selectedSquare} letters={letters[i]} activeLine={activeLine} word={word} done={activeLine > i} handleSquareClick={handleSquareClick}/>
            })}

            <SimpleKeyboard setLetter={setLetter} playWord={playWord} eraseLetter={eraseLetter} greyLetters={greyLetters} greenLetters={greenLetters} yellowLetters={yellowLetters}/>
        </div>
    );
}

export default Board;
