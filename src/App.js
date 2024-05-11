import "./App.css";
import { useState } from "react";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Container } from "./components/Container";


function App() {
  const [drag, setDrag] = useState([]);
  const [drop, setDrop] = useState([]);

  return (
    <div className="App">
      <div className="teste">
          <DndProvider backend={HTML5Backend}>
            <Container/>
          </DndProvider>

        {/* <div className="left">
        </div>

        <div className="rigth">
        </div> */}
      </div>
    </div>
  );
}

export default App;
