function Square({isSelected, letter, word, position, done, handleSquareClick}) {
    let classes = isSelected ? "Square selected" : "Square"

    if(done && letter.toLowerCase() === word.charAt(position)) {
        classes += ' green'
    } else if (done && letter && letter.toLowerCase() !== word.charAt(position) && word.includes(letter.toLowerCase())) {
        classes += ' yellow'
    }

    return (
      <div className={classes} onClick={()=>handleSquareClick(position)}>
        <span>{letter ? letter : ''}</span>
      </div>
    );
  }
  
  export default Square;
  