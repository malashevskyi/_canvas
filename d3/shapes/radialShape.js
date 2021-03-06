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

  const segments = 10;
  const radius = 150;

  const angleScale = d3
    .scaleLinear()
    .domain([1, segments])
    .range([0, Math.PI * 2 + 0.02])

  // clockwise from 12 o’clock
  const radialLineGenerator = d3
    .radialLine()
    .angle((d, i) => angleScale(i))
    .radius(radius)

  const g = svg
    .append('g')
    .attr(
      'transform',
      `translate(${width / 2}, ${height / 2})`
    );

  g.append('path')
    .attr('d', radialLineGenerator(Array(segments)))
    .attr('stroke-width', 10)
    .attr('stroke', 'black');

  return ({ exporting, width, height }) => {
    svg
      .attr('width', width)
      .attr('height', height)
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
