import canvasSketch from 'canvas-sketch';
import * as d3 from 'd3';

const settings = {
  // For SVG to resize easily we will have to set this to true
  scaleToView: true,
  // Do not append <canvas> element
  parent: false,
  dimensions: [512, 512],
};
// https://www.youtube.com/watch?v=TOJ9yjvlapY
const sketch = ({ canvas, width, height }) => {
  // Create some random circle data
  const DUMMY_DATA = [
    { id: 'd1', value: 10, region: 'USA' },
    { id: 'd1', value: 9, region: 'India' },
    { id: 'd1', value: 7, region: 'China' },
    { id: 'd1', value: 14, region: 'Germany' },
  ];

  d3.select('head').append('style').text(/* css */ `
    .container {
      border: 1px solid red;
      box-sizing: border-box;
    }
  `);

  const xScale = d3
    .scaleBand()
    .domain(DUMMY_DATA.map((dataPoint) => dataPoint.region))
    .rangeRound([0, width])
    .padding(0.01);
  const yScale = d3
    .scaleLinear()
    .domain([0, 15])
    .range([height, 0]);

  const svg = d3
    .select('body')
    .append('svg')
    .classed('container', true);

  svg
    .selectAll('.bar')
    .data(DUMMY_DATA)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('width', xScale.bandwidth())
    .attr('height', (data) => {
      return height - yScale(data.value);
    })
    .attr('x', (data) => xScale(data.region))
    .attr('y', (data) => yScale(data.value));

  return ({
    exporting,
    width,
    height,
    styleWidth,
    styleHeight,
  }) => {
    // First update the sizes to our viewport

    svg
      .attr('width', styleWidth)
      .attr('height', styleHeight)
      .attr('viewBox', `0 0 ${width} ${height}`);

    // If exporting, serialize SVG to Blob
    if (exporting) {
      // Clone the SVG element and resize to output dimensions
      const copy = d3
        .select(svg.node().cloneNode(true))
        .attr('width', width)
        .attr('height', height);

      // Make a blob out of the SVG and return that
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
