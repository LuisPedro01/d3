import React, { memo, useState } from 'react';
import { useDrop } from 'react-dnd';

const style = {
  height: '100px',
  width: '100px',
  marginRight: '20px',
  marginBottom: '20x',
  color: 'white',
  padding: '10px',
  textAlign: 'center',
  fontSize: '10px',
  lineHeight: 'normal',
  float: 'left',
};

export const Dustbin = memo(function Dustbin({
  accept,
  lastDroppedItem,
  onDrop,
}) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const [graficos, setGraficos] = useState([])

  
  const isActive = isOver && canDrop;
  let backgroundColor = '#222';
  if (isActive) {
    backgroundColor = 'darkgreen';
  } else if (canDrop) {
    backgroundColor = 'darkkhaki';
  }

  return (
    <div ref={drop} style={{ ...style, backgroundColor }} data-testid="dustbin">
      {console.log('accept', accept)}
      {isActive
        ? 'Release to drop'
        : `Gráfico 1: ${accept.join(', ')}`}

      {lastDroppedItem && (
        <p>Last dropped: {JSON.stringify(lastDroppedItem)}</p>
      )}
    </div>
  );
});
