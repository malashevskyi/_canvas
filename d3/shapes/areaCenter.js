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

  const areaGenerator = d3.area();
  const segments = 7;
  const yScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([height, 0]);
  const xScale = d3
    .scaleLinear()
    .domain([0, segments - 1])
    .range([0, width]);

  areaGenerator
    .x((d, i) => xScale(i))
    .y0((d, i) => yScale(i % 2 === 0 ? 75 : 25))
    .y1((d, i) => yScale(i % 2 === 0 ? 25 : 75));

  const g = svg.append('g');

  g.append('path')
    .attr('d', areaGenerator(Array(segments)))
    .attr('stroke-width', 10)
    .attr('fill', 'red')

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
