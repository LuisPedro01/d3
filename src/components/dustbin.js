// dustbin.js
import React, { memo, useState } from 'react';
import { useDrop } from 'react-dnd';
import * as d3 from 'd3';
import axios from 'axios';

const style = {
  height: '280px',
  width: '280px',
  margin: '20px',
  color: 'white',
  padding: '10px',
  textAlign: 'center',
  fontSize: '12px',
  lineHeight: 'normal',
  float: 'left',
  borderRadius: '10px'
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

  const [graficos, setGraficos] = useState([]);

  const isActive = isOver && canDrop;
  let backgroundColor = '#aeafb0';
  if (isActive) {
    backgroundColor = 'darkgreen';
  } else if (canDrop) {
    backgroundColor = 'darkkhaki';
  }


  async function fetchData() {
    try {
      const response = await axios.get('https://api.spacexdata.com/v4/launches');
      const allLaunches = response.data;
      const latestLaunches = allLaunches.slice(-20); // Retorna os últimos 20 lançamentos
      return latestLaunches;
    } catch (error) {
      console.error('Erro ao buscar dados da API da SpaceX:', error);
      return [];
    }
  }
  

  const createBarChart = () => {
    // Simples exemplo de gráfico
    const data = [10, 20, 30, 40, 50];

    const svg = d3
      .create('svg')
      .attr('width', 200)
      .attr('height', 250)
      .style('margin-top', -30);

    const bars = svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 40)
      .attr('y', (d) => 250 - d * 4)
      .attr('width', 35)
      .attr('height', (d) => d * 4)
      .attr('fill', 'steelblue');

    return svg.node().outerHTML;
  };

  return (
    <div
      ref={drop}
      style={{ ...style, backgroundColor }}
      data-testid="dustbin"
    >
      {isActive ? 'Release to drop' : `Nome : ${lastDroppedItem?.name}`}
      {lastDroppedItem && <p>Variável: {lastDroppedItem.selectedOption}</p>}
      {lastDroppedItem && (
        <div dangerouslySetInnerHTML={{ __html: createBarChart() }} />
      )}
    </div>
  );
});
