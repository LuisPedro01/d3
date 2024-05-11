import update from 'immutability-helper';
import { memo, useCallback, useState } from 'react';
import { Dustbin } from './dustbin.js';
import { Box } from './Box.js';
import { ItemTypes } from './ItemTypes.js';
import axios from 'axios';
import * as d3 from 'd3';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Importe os estilos do ReactDatePicker

export const Container = memo(function Container() {
  const [dustbins, setDustbins] = useState([
    { accepts: ['TODOS'], lastDroppedItem: null },
    { accepts: ['TODOS'], lastDroppedItem: null },
    { accepts: ['TODOS'], lastDroppedItem: null },
    { accepts: ['TODOS'], lastDroppedItem: null },
    { accepts: ['TODOS'], lastDroppedItem: null },
    { accepts: ['TODOS'], lastDroppedItem: null },
    { accepts: ['TODOS'], lastDroppedItem: null },
    { accepts: ['TODOS'], lastDroppedItem: null },
  ]);
  const [boxes, setBoxes] = useState([
    { name: 'Bottle', type: 'TODOS' },
    { name: 'Banana', type: 'TODOS' },
    { name: 'Magazine', type: 'TODOS' },
  ]);
  const [droppedBoxNames, setDroppedBoxNames] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  function isDropped(boxName) {
    return droppedBoxNames.indexOf(boxName) > -1;
  }

  const handleDrop = useCallback(
    async (index, item) => {
      const { name } = item;
      setDroppedBoxNames((prevNames) =>
        update(prevNames, name ? { $push: [name] } : { $push: [] })
      );
      setDustbins((prevDustbins) =>
        update(prevDustbins, {
          [index]: {
            lastDroppedItem: {
              $set: item,
            },
          },
        })
      );
    },
    [setDroppedBoxNames, setDustbins]
  );

  const addNewGraph = () => {
    setBoxes((prevBoxes) =>
      update(prevBoxes, {
        $push: [{ name: 'Bottle', type: ItemTypes.TODOS }],
      })
    );
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100%" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "10px",
          width: "500px",
          border: "1px solid",
        }}
      >
        {/* Nome Gráfico */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: '20px' }}>
          <span>Nome do Gráfico:</span>
          <input type={'text'} style={{height: '20px', border: '1px solid', borderRadius: '5px'}}></input>
        </div>


        {/* Filtro Datas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <span>Data Inicio:</span>
          <ReactDatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            className='datePicker'
          />
          <span>Data Fim:</span>
          <ReactDatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            className='datePicker'
          />
        </div>

        {/* Filtro tipo de Gráfico */}
        <div
          style={{ display: "flex", marginTop: "20px", marginBottom: "20px", alignItems: 'center' }}
        >
          <span>Tipo de gráfico:</span>
          <select style={{width: '120px', height: '30px', borderRadius: '5px'}}>
            <option value="fruit">Capsules</option>
            <option value="vegetable">Cores</option>
            <option value="meat">Dragons</option>
            <option value="meat">History</option>
            <option value="meat">Info</option>
            <option value="meat">Landing Pads</option>
            <option value="meat">Launches</option>
            <option value="meat">Launches Pads</option>
            <option value="meat">Missions</option>
            <option value="meat">Payloads</option>
            <option value="meat">Rockets</option>
            <option value="meat">Roadster</option>
            <option value="meat">Ships</option>
          </select>
        </div>

        {/* Criar Gráfico */}
        <div style={{ marginBottom: "10px", cursor: "pointer", border: '2px solid blue', borderRadius: '5px' }}>
          <span onClick={addNewGraph}>Create new Graph</span>
        </div>

        <hr style={{width: '100%', marginBottom: '20px'}}></hr>

        {boxes.map(({ name, type }, index) => (
          <Box
            name={name}
            type={type}
            isDropped={isDropped(name)}
            key={index}
          />
        ))}
      </div>

      <div style={{ border: "1px solid" }}>
        <div style={{ marginBottom: "20px", marginTop: "20px" }}>
          <span>Lista de Gráficos</span>
        </div>
        {dustbins.map(({ accepts, lastDroppedItem }, index) => (
          <Dustbin
            accept={accepts}
            lastDroppedItem={lastDroppedItem}
            onDrop={(item) => handleDrop(index, item)}
            key={index}
          />
        ))}
      </div>
    </div>
  );
});
