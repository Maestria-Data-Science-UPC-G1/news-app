import d3, { scaleOrdinal, schemeCategory10 } from 'd3';
import { Link, Node } from './data';

export const RADIUS = 7;

export const drawNetwork = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  nodes: Node[],
  links: Link[]
) => {
  context.clearRect(0, 0, width, height);

  // Color Scale
  const allGroups = [...new Set(nodes.map((d) => String(d.group)))];
  const colorScale = scaleOrdinal<string>()
    .domain(allGroups)
    .range(schemeCategory10);

  // Create a color mapping object
  const colorMapping: { [key: number]: string } = {};
  nodes.forEach((node) => {
    if (!colorMapping[node.group]) {
      colorMapping[node.group] = colorScale(String(node.group));
    }
  });

  //console.log(colorMapping);
  // Draw the legend
  const legendX = 10;
  const legendY = 10;
  const legendWidth = 100;
  const legendHeight = Object.keys(colorMapping).length * 20;

  //context.fillStyle = '#fff';
  context.fillStyle = 'rgba(255, 255, 255, 0)'; // Establece el color de relleno en blanco transparente
  context.fillRect(legendX, legendY, legendWidth, legendHeight);

  let i = 0;
  for (const group in colorMapping) {
    const color = colorMapping[group];
    const x = legendX + 10;
    const y = legendY + 10 + i * 20;

    context.fillStyle = color;
    context.fillRect(x, y, 10, 10);

    context.fillStyle = '#000';
    context.fillText(group, x + 20, y + 10);

    i++;
  }


  // Draw the links first
  context.globalAlpha = 0.6;
  context.strokeStyle = '#999';
  context.lineWidth = 1;

  links.forEach((link) => {
    context.beginPath();
    if (link.source.x && link.source.y && link.target.x && link.target.y) {
      context.moveTo(link.source.x, link.source.y);
      context.lineTo(link.target.x, link.target.y);
      context.stroke();
    }
  });

  // Draw the nodes
  context.globalAlpha = 1;
  context.strokeStyle = '#fff';
  context.lineWidth = 3;
  nodes.forEach((node) => {
    if (!node.x || !node.y) {
      return;
    }


    context.fillStyle = colorScale(String(node.group));
    context.beginPath();
    context.moveTo(node.x + RADIUS, node.y);
    context.arc(node.x, node.y, RADIUS, 0, 2 * Math.PI);
    context.stroke();
    context.fill();

    context.fillStyle = '#000'; // Establece el color de relleno en negro
    context.fillText(node.id, node.x, node.y);
  });
};
