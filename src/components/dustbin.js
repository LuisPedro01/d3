import React, { memo, useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';
import * as d3 from 'd3';
import axios from 'axios';
import { AiTwotoneDelete, AiOutlineReload } from "react-icons/ai";
import { db } from './firebase';
import { getDocs, addDoc, collection } from 'firebase/firestore';

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
  index,
  onReload,
  startDate,
}) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept,
    drop: (item) => {
      fetchData(item, startDate);
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const [isHovered, setIsHovered] = useState(false);
  const [rocketData, setRocketData] = useState({ names: [], counts: [] });
  const [chartHtml, setChartHtml] = useState([]);
  const [chartHtml1, setChartHtml1] = useState([]);
  const [formDB, setFromDB] = useState(false)

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

  const reloadFilter = (variavel, startDate1) => {
    fetchData(variavel, startDate1).then((res) => console.log('resposta', res))
  }

  async function fetchData(variavel, startDate1) {
    const startDate = new Date(variavel.startDate);
    const endDate = new Date(variavel.endDate);
    let startDateFormatted
    if (startDate1) {
      const startYear = startDate1?.getUTCFullYear();
      const startMonth = (startDate1?.getUTCMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 pois o mês é base 0
      const startDay = startDate1?.getUTCDate().toString().padStart(2, '0');
      startDateFormatted = `${startYear}-${startMonth}-${startDay}`
    } else {
      const startYear = startDate?.getUTCFullYear() || startDate1?.getUTCFullYear();
      const startMonth = (startDate?.getUTCMonth() + 1).toString().padStart(2, '0') || (startDate1?.getUTCMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 pois o mês é base 0
      const startDay = startDate?.getUTCDate().toString().padStart(2, '0') || startDate1?.getUTCDate().toString().padStart(2, '0');
      startDateFormatted = `${startYear}-${startMonth}-${startDay}`
    }

    const endYear = endDate?.getUTCFullYear();
    const endMonth = (endDate?.getUTCMonth() + 1).toString().padStart(2, '0'); // Adiciona 1 pois o mês é base 0
    const endDay = endDate?.getUTCDate().toString().padStart(2, '0');
    const endDateFormatted = `${endYear}-${endMonth}-${endDay}`

    if(variavel.selectedOption === 'launch'){
      try {
        const response = await axios.get(`https://api.spacexdata.com/v3/launches`, {
          params: {
            start: startDateFormatted,
            end: endDateFormatted
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
        const rocketNames = Object.keys(rocketCounts);
        const rocketCountsArray = Object.values(rocketCounts);
  
        setRocketData({ names: rocketNames, counts: rocketCountsArray });
        const chart = createChart(lastDroppedItem, rocketNames, rocketCountsArray);
        setChartHtml(chart);
        if (lastDroppedItem) {
          await saveChartToFirebase(lastDroppedItem, chart);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da API da SpaceX:', error);
      }
    }
    if (variavel.selectedOption === "site") {
      try {
        const response = await axios.get(
          "https://api.spacexdata.com/v3/launches",
          {
            params: {
              start: startDateFormatted,
              end: endDateFormatted
            }
          }
        );
        const data = response.data;
        const launchSiteCounts = {};
        data.forEach((launch) => {
          if (launch.launch_site && launch.launch_site.site_name) {
            const siteName = launch.launch_site.site_name;
            if (launchSiteCounts[siteName]) {
              launchSiteCounts[siteName]++;
            } else {
              launchSiteCounts[siteName] = 1;
            }
          }
        });
        const rocketNames = Object.keys(launchSiteCounts);
        const rocketCountsArray = Object.values(launchSiteCounts);
  
        setRocketData({ names: rocketNames, counts: rocketCountsArray });
        const chart = createChart(lastDroppedItem, rocketNames, rocketCountsArray);
        setChartHtml(chart);
        if (lastDroppedItem) {
          await saveChartToFirebase(lastDroppedItem, chart);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da API da SpaceX:", error);
        return {};
      }
    }
    if(variavel.selectedOption === 'success'){
      try {
        const response = await axios.get('https://api.spacexdata.com/v3/launches', {
          params: {
            start: startDateFormatted,
            end: endDateFormatted
          }
        });
        const data = response.data;
        let successCount = 0;
        let failureCount = 0;
    
        data.forEach(launch => {
          const isSuccess = launch.launch_success;
    
          if (isSuccess !== null && isSuccess !== undefined) {
            if (isSuccess) {
              successCount++;
            } else {
              failureCount++;
            }
          }
        });
 
        const obj = {Sucesso: successCount, Falha: failureCount}
          
        const rocketNames = Object.keys(obj);
        const rocketCountsArray = Object.values(obj);
      
        setRocketData({ names: rocketNames, counts: rocketCountsArray });
        const chart = createChart(lastDroppedItem, rocketNames, rocketCountsArray);
        setChartHtml(chart);
        if (lastDroppedItem) {
          await saveChartToFirebase(lastDroppedItem, chart);
        }
      
      } catch (error) {
        console.error('Erro ao buscar dados da API da SpaceX:', error);
        return { true: 0, false: 0 };
      }
      
    }
  }

  const saveChartToFirebase = async (lastDroppedItem, chartHtml) => {
    try {
      await addDoc(collection(db, 'charts'), {
        name: lastDroppedItem.name,
        type: lastDroppedItem.selectedGraph,
        kpi: lastDroppedItem.selectedOption,
        chartHtml: chartHtml,
        startDate: lastDroppedItem.startDate,
        endDate: lastDroppedItem.endDate,
        createdAt: new Date(),
        index: index
      });
      console.log('Gráfico salvo no Firebase');
    } catch (error) {
      console.error('Erro ao salvar gráfico no Firebase:', error);
    }
  };

  const fetchCharts = async () => {
    try {
      const chartsCollection = collection(db, 'charts');
      const chartsSnapshot = await getDocs(chartsCollection);
      const chartsList = chartsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      const updatedCharts = new Array(chartsList.length).fill(null);

      chartsList.forEach((obj, index) => {
        updatedCharts[index] = obj;
      });
  
      setChartHtml1(updatedCharts);
      if(updatedCharts.length === 0){
        setFromDB(false)
      } else{
        setFromDB(true);
      }
    } catch (error) {
      console.error("Erro ao buscar gráficos:", error);
    }
  };
  
  useEffect(()=>{
    fetchCharts();
  }, [])

  const createChart = (lastDroppedItem, rocketNames, rocketCounts) => {
    if (rocketNames.length === 0 || rocketCounts.length === 0) {
      return `<div style="color: red; text-align: center; margin-top: 20px;">Não existem dados disponíveis para criar o gráfico.</div>`;
    }
    let drawChart;

    switch (lastDroppedItem.selectedGraph) {
      case "linhas":
        drawChart = drawLineChart;
        break;
      case "barras":
        drawChart = drawBarChart;
        break;
      case "pizza":
        drawChart = drawPizzaChart;
        break;
      case "bolhas":
        drawChart = drawBolhaChart;
        break;
      case "donnut":
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

  const drawPizzaChart = (svg, rocketNames, rocketCounts) => {
    const pie = d3.pie();
    const arc = d3.arc().innerRadius(0).outerRadius(100);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pieData = pie(rocketCounts);
    svg.selectAll("path")
      .data(pieData)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => color(i))
      .attr("transform", `translate(130, 135)`);

    // Adiciona a legenda
    const legend = svg.append("g")
      .attr("transform", "translate(0, 10) scale(0.8)")
      .selectAll(".legend")
      .data(rocketNames)
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
      .text((d) => d); 
  };

  const drawBolhaChart = (svg, rocketNames, rocketCounts) => {
    const width = 250;
    const height = 250;
    const radius = d3.scaleSqrt()
      .domain([0, d3.max(rocketCounts)])
      .range([0, 50]);

    const nodes = rocketNames.map((name, i) => ({
      id: name,
      radius: radius(rocketCounts[i]),
      value: rocketCounts[i]
    }));

    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(5))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.radius + 1))
      .on('tick', ticked);

    const node = svg.selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.radius)
      .attr('fill', 'steelblue')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    function ticked() {
      node.attr('cx', d => d.x)
        .attr('cy', d => d.y);
    }

    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  const drawDonnutChart = (svg, rocketNames, rocketCounts) => {
    const donnutData = d3.pie()(rocketCounts);
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
      .attr("transform", "translate(130, 135)");

    // Adiciona a legenda
    const legend = svg.append("g")
      .attr("transform", "translate(0, 10) scale(0.8)")
      .selectAll(".legend")
      .data(rocketNames)
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
      .text((d) => d); 
  };

  useEffect(() => {
    if (lastDroppedItem) {
      fetchData(lastDroppedItem);
    }
  }, [lastDroppedItem]); 
  
  return (
    <div
      ref={drop}
      style={{ ...style, backgroundColor, filter: backgroundColor === '#f0f0f0' ? 'blur(0.5px)' : '' }}
      data-testid="dustbin"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {lastDroppedItem && (
        <AiOutlineReload
          style={{ float: 'left', cursor: 'pointer', width: '15px', height: '15px' }}
          onClick={() => {
            onReload(lastDroppedItem, startDate)
            reloadFilter(lastDroppedItem, startDate)
          }}
        />
      )}
      {isHovered && (
        <div style={{ float: 'right', cursor: 'pointer', marginLeft: '-20px', marginBottom: '-1px' }} onClick={handleDelete}>
          {index >= 5 && (
            <AiTwotoneDelete style={{ width: '15px', height: '15px' }} />
          )}
        </div>
      )}

      {lastDroppedItem && (
        <>
          <p>Nome : {lastDroppedItem?.name}</p>
          <p>Variável: {lastDroppedItem.selectedOption}</p>
          {rocketData.names.length > 0 && rocketData.counts.length > 0 && (
            <div dangerouslySetInnerHTML={{ __html: chartHtml }} />
          )}
        </>
      )}

      {formDB && chartHtml1 && (
        <>
          {chartHtml1?.map((obj, objIndex) => {
            if (objIndex === index) {
              return (
                <React.Fragment key={obj?.id}>
                  <p>Nome : {obj?.name}</p>
                  <p>Variável: {obj?.kpi}</p>
                  <div dangerouslySetInnerHTML={{ __html: obj?.chartHtml }} />
                </React.Fragment>
              );
            }
            return null;
          })}
        </>
      )}
    </div>
  );
});
