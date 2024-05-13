import React, { memo } from 'react';
import { useDrag } from 'react-dnd';

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
};

export const Box = memo(function Box({ name, startDate, endDate, selectedOption, type, isDropped }) {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item: { name, startDate, endDate, selectedOption },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, type]
  );

  return (
    <div ref={drag} style={{ ...style, opacity }} data-testid="box">
      {isDropped ? <s>{name}</s> : name}
    </div>
  );
});
