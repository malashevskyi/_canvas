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

  const data = Array(10).fill('');

  const xScale = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([0, width]);
  const yScale = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([0, height]);

  const wScale = d3
    .scaleBand()
    .domain(data.map((el, i) => i))
    .range([0, width])
    .padding(0.03);
  const hScale = d3
    .scaleBand()
    .domain(data.map((el, i) => i))
    .range([0, height])
    .padding(0.03);

  svg
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr(
      'transform',
      (d, i) => `translate(0, ${yScale(i)})`
    )
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d, i) => xScale(i))
    .attr('y', 0)
    .attr('width', wScale.bandwidth())
    .attr('height', hScale.bandwidth())
    .attr('fill', 'red');

  return ({ exporting, width, height }) => {
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    if (exporting) {
      const copy = d3
        .select(svg.node().cloneNode(true))
        .attr('width', width)
        .attr('height', height);

      const data = svgToBlob(copy.node());
      return { data, extension: '.svg' };
    }
  };
};

canvasSketch(sketch, settings);

function svgToBlob(svg) {
  const svgAsXML = new window.XMLSerializer().serializeToString(
    svg
  );
  return new window.Blob([svgAsXML], {
    type: 'image/svg+xml',
  });
}
