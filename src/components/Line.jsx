import Square from "./Square";

function Line({ isActive, selectedSquare, letters, done, word, handleSquareClick }) {
    return (
        <div className="Line">
            {
                letters.map((l, i) => {
                    return <Square key={i} isSelected={isActive && selectedSquare === i} letter={letters[i]} word={word} position={i} done={done} handleSquareClick={handleSquareClick} />

                })
            }
        </div>
    );
}

export default Line;
