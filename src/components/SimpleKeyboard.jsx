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
        display={{ '{bksp}': `<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjkwIiBoZWlnaHQ9IjI1NSIgdmlld0JveD0iMCAwIDI5MCAyNTUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xOS44OTE0IDEyNy4yNTFMMTAzLjA2OCA0MEgyNzVWMjE2SDEwMy4xM0wxOS44OTE0IDEyNy4yNTFaIiBzdHJva2U9IiNGQUZBRkYiIHN0cm9rZS13aWR0aD0iMjYiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPGxpbmUgeDE9IjEzIiB5MT0iLTEzIiB4Mj0iMTMwLjk0NyIgeTI9Ii0xMyIgdHJhbnNmb3JtPSJtYXRyaXgoMC43MDcxMDcgMC43MDcxMDcgLTAuNzY1MzY3IDAuNjQzNTk0IDExNSA4NikiIHN0cm9rZT0iI0ZBRkFGRiIgc3Ryb2tlLXdpZHRoPSIyNiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxsaW5lIHgxPSIxMyIgeTE9Ii0xMyIgeDI9IjEzMC45NDciIHkyPSItMTMiIHRyYW5zZm9ybT0ibWF0cml4KDAuNzA3MTA3IC0wLjcwNzEwNyAwLjc2NTM2NyAwLjY0MzU5NCAxMzMuNDY1IDE4Ny43ODYpIiBzdHJva2U9IiNGQUZBRkYiIHN0cm9rZS13aWR0aD0iMjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8L3N2Zz4K" style="
        width: 25px;
        filter: invert(0.9);
        margin-top: 4px;
        /* margin-right: 0px; */
    ">`, '{enter}': 'enter' }}
        layout={{
          'default': [
            'q w e r t y u i o p',
            'a s d f g h j k l {bksp}',
            'z x c v b n m {enter}'
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
          },
          {
            class: "disabled",
            buttons: " "
          }
        ]}
      />
    </div>
  );
}

export default SimpleKeyboard