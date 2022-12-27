import Line from "./Line";
import SimpleKeyboard from "./SimpleKeyboard"
import { words } from '../utils/words'
import { allWordsArr } from '../utils/allWordsArr'
import { useEffect, useState, useRef } from "react"
import app from '../firebase'
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore/lite';

function Board() {
    const [loading, setLoading] = useState(true)
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
                    setTimeout(() => {
                        alert('Acertou! A palavra é ' + progress.word)
                    }, 100);         
                    setActiveLine(6)          
                }
        
                if (progress.word !== progress.letters[progress.activeLine - 1].toString().replaceAll(',', '').toLowerCase() && progress.activeLine + 1 > 5 && !correct) {
                    setTimeout(() => {
                        alert('Errooooou! A palavra é ' + progress.word)
                    }, 100);
                }
            }
        }
    }

    async function loadWord() {
        const db = getFirestore(app)

        const termoCol = collection(db, 'termo')
        const termoSnapshot = await getDocs(termoCol)

        termoSnapshot.docs.forEach(async document => {
            const data = document.data()

            if (new Date(data.lastUpdated.seconds * 1000).toDateString() === new Date().toDateString()) {
                setWord(data.todaysWord)
                setLoading(false)
                return
            }

            const newWord = words[Math.floor(Math.random() * (Math.floor(words.length) - Math.ceil(1) + 1)) + Math.ceil(1)].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            const newBlackList = data.blackList
            if (newBlackList.includes(newWord)) {
                loadWord()
            } else {
                setWord(newWord)
                newBlackList.push(newWord)
                const docRef = doc(db, 'termo', document.id)
                await updateDoc(docRef, {
                    blackList: newBlackList,
                    lastUpdated: new Date(),
                    todaysWord: newWord
                })
                setLoading(false)
            }
        })
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
            setTimeout(() => {
                alert('Acertou! A palavra é ' + stateRef.current.word)
            }, 100);
            
            isGameOver = true
        }

        if (stateRef.current.word !== stateRef.current.letters[stateRef.current.activeLine].toString().replaceAll(',', '').toLowerCase() && stateRef.current.activeLine + 1 > 5) {
            setTimeout(() => {
                alert('Errooooou! A palavra é ' + stateRef.current.word)
            }, 100);
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

    if(loading) {
        return (
            <div className="Board">
                <span className="loading">Carregando...</span>
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
