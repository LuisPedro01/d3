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
  const [numLaunches, setNumLaunches] = useState(null);
  const [rocketData, setRocketData] = useState({ names: [], counts: [] });

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

  async function fetchData(variavel, rocketNames, rocketCounts) {
    const startDate = new Date(variavel.startDate);
    const endDate = new Date(variavel.endDate);

    const startYear = startDate?.getUTCFullYear();
    const startMonth = (startDate?.getUTCMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 pois o mês é base 0
    const startDay = startDate?.getUTCDate().toString().padStart(2, '0');
    const startDateFormatted = `${startYear}-${startMonth}-${startDay}`

    const endYear = endDate?.getUTCFullYear();
    const endMonth = (endDate?.getUTCMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 pois o mês é base 0
    const endDay = endDate?.getUTCDate().toString().padStart(2, '0');
    const endDateFormatted = `${endYear}-${endMonth}-${endDay}`

    try {
        const response = await axios.get(`https://api.spacexdata.com/v3/launches`, {
            params: {
                start: startDateFormatted, // Defina a data de início
                end: endDateFormatted    // Defina a data de término
            }
        });
        const allLaunches = response.data;        
        const rocketCounts = {};
        
        allLaunches.forEach(launch => {
          const rocketName = launch.rocket.rocket_name;
          if (rocketCounts.hasOwnProperty(rocketName)) {
            rocketCounts[rocketName]++;
          } else {
            rocketCounts[rocketName] = 1;
          }
        });
        
        for (const rocketName in rocketCounts) {
          console.log(`${rocketName}: ${rocketCounts[rocketName]}`);
        }
        
        const rocketNames = Object.keys(rocketCounts);
        const rocketCountsArray = Object.values(rocketCounts);
        setRocketData({ names: rocketNames, counts: rocketCountsArray });

        setNumLaunches(allLaunches.length);
    } catch (error) {
        console.error('Erro ao buscar dados da API da SpaceX:', error);
    }
}

  const createChart = (lastDroppedItem, rocketNames, rocketCounts) => {
    let data;
    let drawChart;
    switch (lastDroppedItem) {
      case "linhas":
        data = [0, 10, 15, 10, 25];
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
        data = [0, 10, 20, 5, 20];
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
      .attr('width', 280)
      .attr('height', 250)
      .style('margin-top', -20)
      .style('margin-left', 10);

    drawChart(svg, rocketNames, rocketCounts);

    return svg.node().outerHTML;
  };

  const drawLineChart = (svg, data) => {
    const margin = { top: 20, right: 0, bottom: 30, left: 35 };
    const width = 200 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .nice()
      .range([height, 0]);

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
      .call(xAxis);

    svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(yAxis);

    const line = d3.line()
      .x((d, i) => x(i + 0.9))
      .y(d => y(d - 2.5));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left / 2 - 15)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Eixo Y");

    svg.append("text")
      .attr("y", height + margin.top + (margin.bottom / 2))
      .attr("x", width / 2 + 50)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Eixo X");
  };

  const drawBarChart = (svg, rocketNames, rocketCounts) => {
    const margin = { top: 20, right: 0, bottom: 30, left: 35 };
    const width = 200 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;
  
    const x = d3.scaleBand()
      .domain(rocketNames)
      .range([0, width])
      .padding(0.1);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(rocketCounts)])
      .nice()
      .range([height, 0]);
  
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);
  
    svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "translate(30, 5)");
  
    svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(yAxis);
  
    svg.selectAll("rect")
      .data(rocketCounts)
      .enter().append("rect")
      .attr("x", (d, i) => margin.left + x(rocketNames[i]))
      .attr("y", (d) => margin.top + y(d))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d))
      .attr("fill", "steelblue");
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
      .attr("transform", `translate(130, 120)`);

    // Adiciona a legenda
    const legend = svg.append("g")
      .attr("transform", "translate(0, 20)")
      .attr("transform", "scale(0.8)")
      .selectAll(".legend")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    // Adiciona quadrados coloridos à legenda
    legend.append("rect")
      .attr("x", 0)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d, i) => color(i));

    // Adiciona texto à legenda
    legend.append("text")
      .attr("x", 15)
      .attr("y", 5)
      .attr("dy", ".35em")
      .text((d, i) => `Category ${i + 1}`);
  };

  const drawBolhaChart = (svg, data) => {
    const margin = { top: 10, right: 20, bottom: 50, left: 50 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
      .domain([0, data.length])
      .range([0, width]);
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([height, 0]);

    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d, i) => xScale(i) + 50)
      .attr("cy", d => yScale(d) + 20)
      .attr("r", d => d)
      .attr("fill", "steelblue")

    svg.append("g")
      .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
      .call(d3.axisBottom(xScale));

    svg.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
      .style("text-anchor", "middle")
      .text("X Axis");

    svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(d3.axisLeft(yScale));

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left / 2 - 20)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Y Axis");
  };

  const drawDonnutChart = (svg, data) => {
    const donnutData = d3.pie()(data);
    const arc = d3.arc()
      .innerRadius(50)
      .outerRadius(100);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Adiciona os arcos ao gráfico
    svg.selectAll("path")
      .data(donnutData)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .attr("transform", "translate(130, 120)");

    // Adiciona a legenda
    const legend = svg.append("g")
      .attr("transform", "translate(0, 20)")
      .attr("transform", "scale(0.8)")
      .selectAll(".legend")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    // Adiciona quadrados coloridos à legenda
    legend.append("rect")
      .attr("x", 0)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (d, i) => color(i));

    // Adiciona texto à legenda
    legend.append("text")
      .attr("x", 15)
      .attr("y", 5)
      .attr("dy", ".35em")
      .text((d, i) => `Category ${i + 1}`);
  };

  if(lastDroppedItem){
    fetchData(lastDroppedItem)
  }

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
        <>
        <div dangerouslySetInnerHTML={{ __html: createChart(lastDroppedItem.selectedGraph, rocketData.names, rocketData.counts) }} />
        <div onClick={() => fetchData(lastDroppedItem)}>TESTAR API</div>
        {numLaunches !== null && <p>Número de lançamentos entre as datas: {numLaunches}</p>}
        </>
      )}
    </div>
  );
});
