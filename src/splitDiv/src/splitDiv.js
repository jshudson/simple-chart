const clamp = (number, lower, upper) => {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
};

export default class SplitDiv {
  constructor(parent, direction = 'horizontal') {
    const containerDirectionCSS = `split-div-${direction}`;
    const barDirectionCSS = `split-div-bar-${direction}`;
    this.size = direction == 'horizontal' ? 'width' : 'height';
    this.direction = direction;
    this.parent = parent;
    this.container = parent.appendChild(document.createElement('div'));
    this.container.setAttribute(
      'class',
      `split-div-container ${containerDirectionCSS}`
    );

    this.first = this.container.appendChild(document.createElement('div'));
    this.first.setAttribute('class', 'split-div-child split-div-first');

    this.bar = this.container.appendChild(document.createElement('div'));

    this.bar.setAttribute('class', `split-div-bar ${barDirectionCSS}`);

    this.second = this.container.appendChild(document.createElement('div'));
    this.second.setAttribute('class', `split-div-child split-div-second`);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.bar.addEventListener('mousedown', this.handleMouseDown);
    this.bar.addEventListener('dragstart', this.handleDragStart);
  }
  handleMouseDown(e) {
    e.preventDefault();

    const cursorType = getComputedStyle(this.bar).cursor;
    this.container.setAttribute('style', `cursor:${cursorType}`);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp, { once: true });
  }
  handleMouseMove(e) {
    e.preventDefault();
    const bounds = this.container.getBoundingClientRect();
    const barSize = this.bar.getBoundingClientRect()[this.size];
    const position =
      this.direction == 'horizontal'
        ? e.pageX - bounds.left - barSize/2
        : e.pageY - bounds.top - barSize/2;
    const clamped = clamp(position, 100, bounds[this.size] - 100 - barSize);
    this.first.style[this.size] = `${clamped}px`;

    this.second.style[this.size] = `${bounds[this.size] - barSize - clamped}px`;
  }
  handleMouseUp(e) {
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.container.style.cursor = '';
  }
  handleDragStart(e) {
    return false;
  }
  swap() {
    const dimension = this.first.style[this.size];
    const dimensionAsNumber = Number(dimension.slice(0, dimension.length - 2));

    this.first.style[this.size] = ``;

    this.direction = this.direction == 'horizontal' ? 'vertical' : 'horizontal';
    this.size = this.direction == 'horizontal' ? 'width' : 'height';

    const containerDirectionCSS = `split-div-${this.direction}`;
    const barDirectionCSS = `split-div-bar-${this.direction}`;

    this.container.setAttribute(
      'class',
      `split-div-container ${containerDirectionCSS}`
    );

    this.bar.setAttribute('class', `split-div-bar ${barDirectionCSS}`);
    const bounds = this.container.getBoundingClientRect();

    const clamped = clamp(
      dimensionAsNumber,
      100,
      bounds[this.size] - 100 - this.bar.getBoundingClientRect()[this.size]
    );

    this.first.style[this.size] = `${clamped}px`;
  }
  get containers() {
    return [this.first, this.second];
  }
}
