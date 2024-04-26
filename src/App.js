import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [drag, setDrag] = useState([]);
  const [drop, setDrop] = useState([]);

  return (
    <div className="App">
      <div className="teste">
        <div className="left">
          {drag.map((item) => {
            <div className="itemDrag">
              <span>{item.name}</span>
            </div>;
          })}
        </div>

        <div className="rigth">
          {drop.map((item) => {
            <div className="itemDrop">
              <span>{item.name}</span>
            </div>;
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
