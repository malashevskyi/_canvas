import canvasSketch from 'canvas-sketch';
import * as d3 from 'd3';
import random from 'canvas-sketch-util/random';
import palettes from 'nice-color-palettes';

const settings = {
  // For SVG to resize easily we will have to set this to true
  scaleToView: true,
  // Do not append <canvas> element
  parent: false,
};

const sketch = ({ width, height }) => {
  random.setSeed(1);

  const palette = random.pick(palettes);

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
    [60, 120, 150, 160, 180],
    [30, 135, 105, 60, 185],
    [80, 115, 110, 190, 215],
    [90, 230, 105, 80, 230],
    [70, 240, 105, 220, 240],
    [120, 180, 100, 140, 180],
    [70, 185, 105, 60, 185],
    [120, 115, 110, 100, 215],
    [80, 130, 105, 80, 230],
    [120, 240, 105, 120, 240],
  ];

  const stack = d3
    .stack()
    .keys([0, 1, 2, 3, 4])
    // .order(d3.stackOrderInsideOut)
    // .order(d3.stackOrderReverse)
    // .order(d3.stackOrderDescending)
    // .order(d3.stackOrderAscending)
    .offset(d3.stackOffsetExpand);

  const yScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([height, 0]);

  const areaGenerator =
    d3
      .area()
      .x((d, i) => {
        return (width / (data.length - 1)) * i;
      })
      .y0((d, i) => yScale(d[0]))
      .y1((d, i) => yScale(d[1]))
      // .curve(d3.curveCatmullRom)

  const g = svg.append('g');

  g.selectAll('path')
    .data(stack(data))
    .enter()
    .append('path')
    .attr('fill', (d, i) => {
      return palette[i];
    })
    .attr('d', areaGenerator);

  return {
    render({ exporting, width, height }) {
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
    },
    resize(props) {
      ({ width, height } = props);

      g.selectAll('path').attr('d', areaGenerator);
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
