import canvasSketch from 'canvas-sketch';
import * as d3 from 'd3';

const settings = {
  // For SVG to resize easily we will have to set this to true
  scaleToView: true,
  // Do not append <canvas> element
  parent: false,
  dimensions: [512, 512],
};

const sketch = ({ width, height }) => {
  d3.select('head').append('style').text(/* css */ `
    .svg {
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
  `);

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .classed('svg', true);

  const data = [
    new Date(2021, 0, 1),
    new Date(2022, 0, 1),
    new Date(2023, 0, 1),
    new Date(2024, 0, 1),
    new Date(2025, 0, 1),
    new Date(2026, 0, 1),
    new Date(2027, 0, 1)
  ];

  const timeScale = d3
    .scaleTime()
    .domain([data[0], data[data.length - 1]])
    .range([10, width - 40])

  console.log(timeScale(new Date(2015, 10, 0)));
  svg
    .selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .attr('x', (d) => timeScale(d))
    .attr('y', (d) => height / 2)
    .text((d) => d.getFullYear())

  return ({ width, height }) => {
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);
  };
};

canvasSketch(sketch, settings);
