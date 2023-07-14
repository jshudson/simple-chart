export function handleMouseDown_Integrate(event) {
  console.log(event.offsetX - this.plotDimensions.left);
  console.log(this.plotDimensions.left);
  const click = this.clickToPlotCoordinate(event);

  this.integrals.push({
    x: [click.x, click.x + 0.1],
    y: [click.y, click.y + 1],
  });
  this.render();
}
