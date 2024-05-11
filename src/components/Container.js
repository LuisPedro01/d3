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
  const [boxes, setBoxes] = useState([]);
  const [droppedBoxNames, setDroppedBoxNames] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [name, setName] = useState('')
  const [selectedOption, setSelectedOption] = useState('capsules');

  function isDropped(boxName) {
    return droppedBoxNames.indexOf(boxName) > -1;
  }

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

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
    console.log(name)
    console.log(selectedOption)
    console.log(startDate)
    console.log(endDate)

    if(!hasErrors()){
      setBoxes((prevBoxes) =>
        update(prevBoxes, {
          $push: [{ name: name, type:'TODOS', selectedOption: selectedOption, startDate: startDate, endDate: endDate}],
        })
      );
    }
  };

  const hasErrors = () => {
    if(!name){
      alert('É necessário um nome!')
      return true
    }
  }

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
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: '15px' }}>
          <span>Nome do Gráfico</span>
          <input type={'text'} style={{height: '20px', border: '2px solid #9dadb3', borderRadius: '5px', padding:'5px'}} onChange={(event) => setName(event.target.value)} placeholder={'Insira aqui o nome do gráfico'}></input>
        </div>


        {/* Filtro Datas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <span>Data Inicio</span>
          <ReactDatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            className='datePicker'
          />
          <span>Data Fim</span>
          <ReactDatePicker
            selected={startDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            className='datePicker'
          />
        </div>

        {/* Filtro tipo de Gráfico */}
        <div
          style={{ display: "flex", marginTop: "20px", marginBottom: "20px", alignItems: 'center' }}
        >
          <span>Variável</span>
          <select 
            style={{width: '150px', height: '30px', borderRadius: '5px', marginLeft: '20px', border: '2px solid #9dadb3'}}
            value={selectedOption}
            onChange={handleSelectChange}
          >
            <option value="capsules">Capsules</option>
            <option value="cores">Cores</option>
            <option value="dragons">Dragons</option>
            <option value="history">History</option>
            <option value="info">Info</option>
            <option value="landing_pads">Landing Pads</option>
            <option value="launches">Launches</option>
            <option value="launches_pads">Launches Pads</option>
            <option value="missions">Missions</option>
            <option value="payloads">Payloads</option>
            <option value="rockets">Rockets</option>
            <option value="roadster">Roadster</option>
            <option value="ships">Ships</option>
          </select>
        </div>

        {/* Criar Gráfico */}
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{ marginBottom: "10px", cursor: "pointer", border: '2px solid #1ebffa', borderRadius: '5px', backgroundColor: '#2abff5', padding: '5px', width: '70%', justifyItems: 'center' }}>
            <span onClick={addNewGraph} style={{color: '#ffff'}}>Criar novo gráfico</span>
          </div>
        </div>

        <hr style={{width: '100%', marginBottom: '20px'}}></hr>

        {boxes.length > 0 ? 
          boxes.map(({ name, type }, index) => (
            <Box
              name={name}
              type={type}
              isDropped={isDropped(name)}
              key={index}
            />
          )) : 
          <span style={{color: '#aeafb0'}}>Os seus gráficos aparecerão aqui...</span>
        }

        
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
