//container.js
import update from 'immutability-helper';
import { memo, useCallback, useState } from 'react';
import { Dustbin } from './dustbin.js';
import { Box } from './Box.js';
import { ItemTypes } from './ItemTypes.js';
import axios from 'axios';
import * as d3 from 'd3';


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
    <div style={{display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ border: '2px solid blue', display: 'flex', flexDirection: 'column', padding: '10px', width: '500px'}}>

        <div style={{marginBottom: '20px', cursor: 'pointer'}}>
          <span onClick={addNewGraph}>Create new Graph</span>
        </div>
        {boxes.map(({ name, type }, index) => (
          <Box name={name} type={type} isDropped={isDropped(name)} key={index} />
        ))}
      </div>

      <div style={{ border: '3px solid red' }} className='graficos'>

        <div style={{marginBottom: '20px', marginTop: '20px'}}>
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
