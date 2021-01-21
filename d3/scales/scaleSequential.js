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

  const data = [];
  for (let i = 0; i < 65; i++) data.push(i)

  const xScale = d3
    .scaleLinear()
    .domain([0, 65])
    .range([0, width])
  const sequentialScale = d3
    .scaleSequential()
    .domain([0, 65])
    // .interpolator(d3.interpolateRainbow)
    // .interpolator(d3.interpolateViridis)
    // .interpolator(d3.interpolateInferno)
    // .interpolator(d3.interpolatePlasma)
    // .interpolator(d3.interpolateWarm)
    // .interpolator(d3.interpolateCool)
    // .interpolator(d3.interpolateCubehelixDefault)
    .interpolator(d3.interpolateMagma)

  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d))
    .attr('y', 0)
    .attr('width', 10)
    .attr('height', height)
    .attr('fill', (d) => sequentialScale(d))
    console.log(sequentialScale(2));

  return ({ width, height }) => {
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);
  };
};

canvasSketch(sketch, settings);
