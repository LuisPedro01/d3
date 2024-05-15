import update from 'immutability-helper';
import { memo, useCallback, useState } from 'react';
import { Dustbin } from './dustbin.js';
import { Box } from './Box.js';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const Container = memo(function Container() {
  const [dustbins, setDustbins] = useState([
    { accepts: ['TODOS'], lastDroppedItem: null },
    { accepts: ['TODOS'], lastDroppedItem: null },
    { accepts: ['TODOS'], lastDroppedItem: null },
    { accepts: ['TODOS'], lastDroppedItem: null },
    { accepts: ['TODOS'], lastDroppedItem: null },
  ]);
  const [boxes, setBoxes] = useState([]);
  const [droppedBoxNames, setDroppedBoxNames] = useState([]);
  const [startDate, setStartDate] = useState(new Date("11-30-2020"));
  const [endDate, setEndDate] = useState(new Date("11-30-2020"));
  const [name, setName] = useState('')
  const [selectedOption, setSelectedOption] = useState('capsules');
  const [selectedGraph, setSelectedGraph] = useState('barras');


  function isDropped(boxName) {
    return droppedBoxNames.indexOf(boxName) > -1;
  }

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleSelectChart = (event) => {
    setSelectedGraph(event.target.value);
  };

  const onDelete = (boxName) => {
    setBoxes((prevBoxes) =>
      prevBoxes.filter((box) => box.name !== boxName)
    );
    setDroppedBoxNames((prevNames) =>
      prevNames.filter((name) => name !== boxName)
    );
  };

  const onDelete2 = (index) => {
    setDustbins((prevDustbins) =>
      prevDustbins.filter((_, i) => i !== index)
    );
  };

  const handleDrop = useCallback(
    async (index, item) => {
      const { name, startDate, endDate, selectedOption, selectedGraph } = item;
      setDroppedBoxNames((prevNames) =>
        update(prevNames, name ? { $push: [name, startDate, endDate, selectedOption, selectedGraph] } : { $push: [] })

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
    if(!hasErrors()){
      setBoxes((prevBoxes) =>
        update(prevBoxes, {
          $push: [{ name: name, type:'TODOS', selectedOption: selectedOption, startDate: startDate, endDate: endDate}],
        })
        );
        setName('');
      }
  };

  const hasErrors = () => {
    if(!name){
      alert('É necessário um nome!')
      return true
    }
  }

  const handleAddDustbin = () => {
    setDustbins((prevDustbins) =>
      update(prevDustbins, {
        $push: [{ accepts: ['TODOS'], lastDroppedItem: null }],
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
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: '15px' }}>
          <span>Nome do Gráfico</span>
          <input type={'text'} value={name} style={{height: '20px', border: '2px solid #9dadb3', borderRadius: '5px', padding:'5px'}} onChange={(event) => setName(event.target.value)} placeholder={'Insira aqui o nome do gráfico'}></input>
        </div>


        {/* Filtro Datas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <span>Data Inicio</span>
          <ReactDatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            className='datePicker'
            maxDate={new Date("11-30-2020")}
          />
          <span>Data Fim</span>
          <ReactDatePicker
            selected={startDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            className='datePicker'
            maxDate={new Date("11-30-2020")}
          />
        </div>

        {/* Filtro tipo de Variável */}
        <div
          style={{ display: "flex", marginTop: "20px", marginBottom: "20px", alignItems: 'center' }}
        >
          <span>Routes</span>
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


        {/* Filtro tipo de Gráfico */}
        <div
          style={{ display: "flex", marginTop: "20px", marginBottom: "20px", alignItems: 'center' }}
        >
          <span>Tipo de Gráfico</span>
          <select
            style={{ width: '150px', height: '30px', borderRadius: '5px', marginLeft: '20px', border: '2px solid #9dadb3' }}
            value={selectedGraph}
            onChange={handleSelectChart}
          >
            <option value="barras">Barras</option>
            <option value="linhas">Linhas</option>
            <option value="pizza">Pizza</option>
            <option value="bolhas">Bolhas</option>
            <option value="donnut">Donnut</option>
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
              startDate={startDate}
              endDate={endDate}
              selectedOption={selectedOption}
              selectedGraph={selectedGraph}
              onDelete={onDelete}
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
          <>
          {console.log(index)}
          <Dustbin
            accept={accepts}
            lastDroppedItem={lastDroppedItem}
            onDrop={(item) => handleDrop(index, item)}
            index={index}
            onDelete={onDelete2}
          />
          </>
        ))}

        {/* Dustbin especial com '+' */}
        <div
          style={{
              height: '280px',
              width: '280px',
              margin: '20px',
              color: 'white',
              padding: '10px',
              textAlign: 'center',
              fontSize: '12px',
              lineHeight: 'normal',
              float: 'left',
              borderRadius: '10px',
              border: '2px solid #000000',
              // backgroundColor: '#aeafb0',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'   
          }}
          onClick={handleAddDustbin}
        >
          <span style={{ color: '#aeafb0', fontSize: '100px' }}>+</span>
        </div>
      </div>
    </div>
  );
});
