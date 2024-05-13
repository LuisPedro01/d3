import "./App.css";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Container } from "./components/Container";

function App() {
  return (
    <div className="App">
      <h1>Lançamentos da SpaceX</h1>
      <div className="teste">
          <DndProvider backend={HTML5Backend}>
            <Container/>
          </DndProvider>
      </div>
    </div>
  );
}

export default App;