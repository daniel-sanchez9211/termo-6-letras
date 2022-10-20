import Square from "./Square";

function Line({isActive, selectedSquare, letters, done, word, handleSquareClick}) {
    return (
      <div className="Line">
        <Square isSelected={isActive && selectedSquare === 0} letter={letters[0]} word={word} position={0} done={done} handleSquareClick={handleSquareClick}/>
        <Square isSelected={isActive && selectedSquare === 1} letter={letters[1]} word={word} position={1} done={done} handleSquareClick={handleSquareClick}/>
        <Square isSelected={isActive && selectedSquare === 2} letter={letters[2]} word={word} position={2} done={done} handleSquareClick={handleSquareClick}/>
        <Square isSelected={isActive && selectedSquare === 3} letter={letters[3]} word={word} position={3} done={done} handleSquareClick={handleSquareClick}/>
        <Square isSelected={isActive && selectedSquare === 4} letter={letters[4]} word={word} position={4} done={done} handleSquareClick={handleSquareClick}/>
        <Square isSelected={isActive && selectedSquare === 5} letter={letters[5]} word={word} position={5} done={done} handleSquareClick={handleSquareClick}/>
      </div>
    );
  }
  
  export default Line;
  