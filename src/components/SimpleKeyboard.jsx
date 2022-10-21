import React, { useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

function SimpleKeyboard({setLetter, playWord, eraseLetter, greenLetters, yellowLetters, greyLetters}) {
  const [input, setInput] = useState("");
  const [layout, setLayout] = useState("default");
  const keyboard = useRef();

  const onChange = input => {
    setInput(input);
  };

  const handleShift = () => {
    const newLayoutName = layout === "default" ? "shift" : "default";
    setLayout(newLayoutName);
  };

  const onKeyPress = button => {
    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{enter}") return playWord()
    if (button === "{bksp}") return eraseLetter()
    if (button === "{shift}" || button === "{lock}") handleShift();
    setLetter(button.toUpperCase());
  };

  const onChangeInput = event => {
    const input = event.target.value;
    setInput(input);
    keyboard.current.setInput(input);
  };

  return (
    <div className="Keyboard">
      <Keyboard
        keyboardRef={r => (keyboard.current = r)}
        layoutName={layout}
        onChange={onChange}
        onKeyPress={onKeyPress}
        layout={{
          'default': [
            '          {bksp}',
            'q w e r t y u i o p',
            'a s d f g h j k l {enter}',
            'z x c v b n m    '
          ],
          'shift': [
            '~ ! @ # $ % ^ &amp; * ( ) _ + {bksp}',
            '{tab} Q W E R T Y U I O P { } |',
            '{lock} A S D F G H J K L : " {enter}',
            '{shift} Z X C V B N M &lt; &gt; ? {shift}',
            '.com @ {space}'
          ]
        }}
        buttonTheme={[
          {
            class: "green",
            buttons: greenLetters.join(' ')
          },
          {
            class: "yellow",
            buttons: yellowLetters.join(' ')
          },
          {
            class: "grey",
            buttons: greyLetters.join(' ')
          }
        ]}
      />
    </div>
  );
}

export default SimpleKeyboard