import Line from "./Line";
import SimpleKeyboard from "./SimpleKeyboard"
import { allWordsArr } from '../utils/allWordsArr'
import { useEffect, useState, useRef } from "react"
import { toast } from 'react-toastify';

function Board() {
    const [loading, setLoading] = useState(true)
    const [isWakingUp, setIsWakingUp] = useState(false)
    const [activeLine, setActiveLine] = useState(0)
    const [selectedSquare, setSelectedSquare] = useState(0)
    const [word, setWord] = useState('')
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
        loadWord()
        loadProgress()
    }, [])

    async function loadProgress() {
        const date = localStorage.getItem('date')

        if (date === new Date().toDateString()) {
            const progress = JSON.parse(localStorage.getItem('progress'))
            if (progress) {
                setWord(progress.word)
                setLetters(progress.letters)
                setActiveLine(progress.activeLine)
                setGreenLetters(progress.greenLetters)
                setGreyLetters(progress.greyLetters)
                setYellowLetters(progress.yellowLetters)

                const correct = progress.word === progress.letters[progress.activeLine - 1].toString().replaceAll(',', '').toLowerCase()

                if (correct) {
                    setLoading(false)
                    toast.success('Acertou! A palavra é ' + progress.word)
                    setActiveLine(6)
                }

                if (progress.word !== progress.letters[progress.activeLine - 1].toString().replaceAll(',', '').toLowerCase() && progress.activeLine + 1 > 5 && !correct) {
                    setLoading(false)
                    toast.error('Errooooou! A palavra é ' + progress.word)
                }
            }
        }
    }

    async function loadWord() {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
        let success = false;

        while (!success) {
            try {
                const response = await fetch(`${API_URL}/word`);
                const data = await response.json();

                if (data.word) {
                    setWord(data.word);
                    setLoading(false);
                    success = true;
                    setIsWakingUp(false);
                } else {
                    throw new Error("Palavra não encontrada na resposta");
                }
            } catch (err) {
                console.error("Falha ao buscar palavra. Tentando novamente em 3s...", err);
                setIsWakingUp(true);
                // Fallback: usar palavra local aleatória se o servidor cair ou não responder
                // Espera 3 segundos antes de tentar de novo
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
    }

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

        stateRef.current.letters[stateRef.current.activeLine].forEach(l => {
            if (!l) allFilled = false
        })

        if (!allFilled) return
        if (allWordsArr.indexOf(stateRef.current.letters[stateRef.current.activeLine].toString().replaceAll(',', '').toLowerCase()) === -1) return

        const newGreenLettersArr = [...stateRef.current.greenLetters]
        const newYelloLettersArr = [...stateRef.current.yellowLetters]
        const newGreyLettersArr = [...stateRef.current.greyLetters]

        stateRef.current.letters[stateRef.current.activeLine].forEach((l, i) => {
            if (l.toLowerCase() === stateRef.current.word.charAt(i)) {
                newGreenLettersArr.push(l.toLowerCase())
            } else if (l && l.toLowerCase() !== stateRef.current.word.charAt(i) && stateRef.current.word.includes(l.toLowerCase())) {
                newYelloLettersArr.push(l.toLowerCase())
            } else if (l && !stateRef.current.word.includes(l.toLowerCase())) {
                newGreyLettersArr.push(l.toLowerCase())
            }
        })

        let isGameOver = false;

        if (stateRef.current.word === stateRef.current.letters[stateRef.current.activeLine].toString().replaceAll(',', '').toLowerCase()) {
            setLoading(false)
            toast.success('Acertou! A palavra é ' + stateRef.current.word)

            isGameOver = true
        }

        if (stateRef.current.word !== stateRef.current.letters[stateRef.current.activeLine].toString().replaceAll(',', '').toLowerCase() && stateRef.current.activeLine + 1 > 5) {
            setLoading(false)
            toast.error('Errooooou! A palavra é ' + stateRef.current.word)
        }
        setActiveLine(isGameOver ? 6 : stateRef.current.activeLine + 1)
        setSelectedSquare(0)
        setGreenLetters([...newGreenLettersArr])
        setGreyLetters([...newGreyLettersArr])
        setYellowLetters([...newYelloLettersArr])

        localStorage.setItem('progress', JSON.stringify({
            word: stateRef.current.word,
            letters: stateRef.current.letters,
            activeLine: stateRef.current.activeLine + 1,
            greenLetters: [...newGreenLettersArr],
            greyLetters: [...newGreyLettersArr],
            yellowLetters: [...newYelloLettersArr]
        }))

        localStorage.setItem('date', new Date().toDateString())
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

    if (loading) {
        return (
            <div className="Board">
                <span className="loading">
                    {isWakingUp ? "Acordando servidor... (pode levar 1 min)" : "Carregando..."}
                </span>
            </div>
        )
    }


    return (
        <div className="Board">
            <h1>Termo 6 letras!</h1>

            {letters.map((l, i) => {
                return <Line key={i} isActive={activeLine === i} selectedSquare={selectedSquare} letters={letters[i]} activeLine={activeLine} word={word} done={activeLine > i} handleSquareClick={handleSquareClick} />
            })}

            <SimpleKeyboard setLetter={setLetter} playWord={playWord} eraseLetter={eraseLetter} greyLetters={greyLetters} greenLetters={greenLetters} yellowLetters={yellowLetters} />
        </div>
    );
}

export default Board;
