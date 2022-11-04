function Square({isSelected, letter, word, position, done, handleSquareClick, colorClass}) {
    let classes = isSelected ? "Square selected" : "Square"

    if (done) {
      classes += colorClass
    }
    
    return (
      <div className={classes} onClick={()=>handleSquareClick(position)}>
        <span>{letter ? letter : ''}</span>
      </div>
    );
  }
  
  export default Square;
  