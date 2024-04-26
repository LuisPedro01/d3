import "./App.css";
import { useState } from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Container } from "./components/teste";


function App() {
  const [drag, setDrag] = useState([]);
  const [drop, setDrop] = useState([]);

  return (
    <div className="App">
      <div className="teste">
        <div className="left">

          <DndProvider backend={HTML5Backend}>
            <Container/>
          </DndProvider>
          {/* {drag.map((item) => {
            <div className="itemDrag">
              <span>{item.name}</span>
            </div>
          })} */}
        </div>

        <div className="rigth">
          {drop.map((item) => {
            <div className="itemDrop">
              <span>{item.name}</span>
            </div>
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
