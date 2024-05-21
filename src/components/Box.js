import React, { memo, useState } from 'react';
import { useDrag } from 'react-dnd';
import { AiTwotoneDelete } from "react-icons/ai";

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
  borderRadius: '10px'
};

export const Box = memo(function Box({ name, startDate, endDate, selectedOption, selectedGraph, type, isDropped, onDelete, id }) {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type,
      item: { name, startDate, endDate, selectedOption, selectedGraph, id },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, type]
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = (e) => {
    onDelete(name, id);
  };

  return (
    <div
      ref={drag}
      style={{ ...style, opacity }}
      data-testid="box"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isDropped ? <s>{name}</s> : name}

      <div style={{float: 'right', cursor: 'pointer', marginLeft: '-20px', marginBottom: '-1px'}} onClick={handleDelete}>
        {isHovered && (
          <AiTwotoneDelete />
        )}
      </div>
    </div>
  );
});
