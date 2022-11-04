import Square from "./Square";

function Line({ isActive, selectedSquare, letters, done, word, handleSquareClick }) {
    let countYellows = (word, letters, l) => {
      let greens = 0;
      let countInWord = 0;
      let countInLetters = 0;
      for (let i = 0; i < word.length; i++) {
        if (word.charAt(i) === l && letters[i].toLowerCase() === l) {
          greens++
        }
        if (word.charAt(i) === l) {
          countInWord++;
        }
        if (letters[i].toLowerCase() === l) {
          countInLetters++;
        }
      }
      return Math.min(countInWord-greens,countInLetters-greens)
    }
    let isYellow = (word, letters, totalYellows, index) => {
      let l = letters[index].toLowerCase();
      let lBefore = 0;
      for (let i = 0; i < index; i++) {
        if (letters[i].toLowerCase() === l && word.charAt(i) !== l) {
          lBefore++;
        }
      }
      console.log(letters, totalYellows, index, lBefore)
      return totalYellows > lBefore;
    }
    return (
        <div className="Line">
            {
                letters.map((l, i) => {
                    l = l.toLowerCase();
                    let color = ""
                    if (word.charAt(i) === l) {
                      color = " green"
                    } else if (word.includes(l)) {
                      let totalYellows = countYellows(word, letters, l);
                      color = isYellow(word, letters, totalYellows, i) ? " yellow" : ""
                    }

                    return <Square key={i} isSelected={isActive && selectedSquare === i} letter={letters[i]} word={word} position={i} done={done} handleSquareClick={handleSquareClick} colorClass={color}/>

                })
            }
        </div>
    );
}

export default Line;
