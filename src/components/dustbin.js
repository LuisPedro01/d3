import React, { memo, useState } from 'react';
import { useDrop } from 'react-dnd';
import * as d3 from 'd3';
import axios from 'axios';
import { AiTwotoneDelete } from "react-icons/ai";

const style = {
  height: '280px',
  width: '280px',
  margin: '20px',
  color: '#000000',
  padding: '10px',
  textAlign: 'center',
  fontSize: '12px',
  lineHeight: 'normal',
  float: 'left',
  borderRadius: '10px',
  border: '2px solid #000000',
};

export const Dustbin = memo(function Dustbin({
  accept,
  lastDroppedItem,
  onDrop,
  onDelete,
  index
}) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = () => {
    onDelete(index);
  };

  const isActive = isOver && canDrop;
  let backgroundColor = '#fff';
  if (isActive) {
    backgroundColor = '#a9e6fc';
  } else if (canDrop) {
    backgroundColor = '#f0f0f0';
  }

  async function fetchData() {
    try {
      const response = await axios.get('https://api.spacexdata.com/v4/launches');
      const allLaunches = response.data;
      const latestLaunches = allLaunches.slice(-20);
      return latestLaunches;
    } catch (error) {
      console.error('Erro ao buscar dados da API da SpaceX:', error);
      return [];
    }
  }
  

  const createChart = (lastDroppedItem) => {
    let data;
    let drawChart;  
    switch (lastDroppedItem) {
      case "linhas":
        data = [10, 20, 30, 40, 50];
        drawChart = drawLineChart;
        break;
      case "barras":
        data = [10, 20, 30, 40, 50];
        drawChart = drawBarChart;
        break;
      case "pizza":
        data = [10, 20, 30, 40, 50];
        drawChart = drawPizzaChart;
        break;
      case "bolhas":
        data = [10, 20, 30, 40, 50];
        drawChart = drawBolhaChart;
        break;
      case "donnut":
        data = [10, 20, 30, 40, 50];
        drawChart = drawDonnutChart;
        break;
      default:
        return null;
    }
  
    const svg = d3.create('svg')
      .attr('width', 200)
      .attr('height', 250)
      .style('margin-top', -30);
  
    drawChart(svg, data);
  
    return svg.node().outerHTML;
  };
  
  const drawLineChart = (svg, data) => {
    const line = d3.line()
      .x((d, i) => i * 40)
      .y(d => 250 - d * 4);
  
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);
  };
  
  const drawBarChart = (svg, data) => {
    const bars = svg.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * 40)
      .attr('y', (d) => 250 - d * 4)
      .attr('width', 35)
      .attr('height', (d) => d * 4)
      .attr('fill', 'steelblue');
  };

  const drawPizzaChart = (svg, data) => {
    const pie = d3.pie();
    const arc = d3.arc().innerRadius(0).outerRadius(100);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pieData = pie(data);
    svg.selectAll("path")
       .data(pieData)
       .enter()
       .append("path")
       .attr("d", arc)
       .attr("fill", (d, i) => color(i))
       .attr("transform", "translate(100, 120)");
  };
  
  const drawBolhaChart = (svg, data) => {
    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", (d, i) => i * 40)
       .attr("cy", d => 250 - d * 4)
       .attr("r", d => d)
       .attr("fill", "steelblue");
  };
  
  const drawDonnutChart = (svg, data) => {
    const donnutData = d3.pie()(data);
    const arc = d3.arc()
                  .innerRadius(50)
                  .outerRadius(100);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    svg.selectAll("path")
       .data(donnutData)
       .enter()
       .append("path")
       .attr("d", arc)
       .attr("fill", (d, i) => color(i))
       .attr("transform", "translate(100, 120)");
  };

  return (
    <div
      ref={drop}
      style={{ ...style, backgroundColor, filter: backgroundColor === '#f0f0f0' ? 'blur(0.5px)' : '' }}
      data-testid="dustbin"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && (
        <div style={{ float: 'right', cursor: 'pointer', marginLeft: '-20px', marginBottom: '-1px' }} onClick={handleDelete}>
          {index >= 5 && (
            <AiTwotoneDelete style={{ width: '15px', height: '15px' }} />
          )}
        </div>

      )}
      {isActive ? 'Release to drop' : `Nome : ${lastDroppedItem?.name}`}
      {lastDroppedItem && <p>Variável: {lastDroppedItem.selectedOption}</p>}
      {lastDroppedItem && (
        <div dangerouslySetInnerHTML={{ __html: createChart(lastDroppedItem.selectedGraph) }} />
      )}
    </div>
  );
});
