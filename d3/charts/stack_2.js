import canvasSketch from 'canvas-sketch';
import * as d3 from 'd3';
import random from 'canvas-sketch-util/random';
import palettes from 'nice-color-palettes';

const settings = {
  // For SVG to resize easily we will have to set this to true
  scaleToView: true,
  // Do not append <canvas> element
  parent: false,
  // dimensions: [1012, 512],
};

const sketch = ({ width, height }) => {
  random.setSeed(1);

  const palette = random.pick(palettes);
  const colors = [palette[0], palette[1], palette[2]];

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
    [120, 180, 100],
    [60, 185, 105],
    [100, 215, 110],
    [80, 230, 105],
    [120, 240, 105],
    [120, 180, 100],
    [60, 185, 105],
    [100, 215, 110],
    [80, 230, 105],
    [120, 240, 105],
  ];
  const maxSum = Math.max(
    ...data.map((arr) =>
      arr.reduce((sum, val) => sum + val)
    )
  );

  const stack = d3.stack().keys([0, 1, 2]);
  // const stack = d3.stack().keys([0, 1, 2]).order(d3.stackOrderInsideOut);
  // const stack = d3.stack().keys([0, 1, 2]).order(d3.stackOrderReverse);
  // const stack = d3.stack().keys([0, 1, 2]).order(d3.stackOrderDescending);
  // const stack = d3.stack().keys([0, 1, 2]).order(d3.stackOrderAscending);

  const yScale = d3
    .scaleLinear()
    .domain([0, 600])
    .range([650, 0]);

  const areaGenerator = () =>
    d3
      .area()
      .x((d, i) => {
        return (width / (data.length - 1)) * i;
      })
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]));

  const g = svg.append('g');

  g.selectAll('path')
    .data(stack(data))
    .enter()
    .append('path')
    .attr('fill', (d, i) => colors[i])
    .attr('d', areaGenerator());

  return {
    render({ exporting, width, height }) {
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
    },
    resize(props) {
      ({ width, height } = props);

      g.selectAll('path')
        .attr('d', areaGenerator());
    },
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
