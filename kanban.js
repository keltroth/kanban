import { Emitter } from './emitter.js';

const signals = ['moved'];

const defaultOptions = {
  dropSelector: '.js-kanban-droppable',
  dragSelector: '.js-kanban-draggable',
  selector: '.js-kanban'
};

export class Kanban extends Emitter {
  constructor(options = defaultOptions) {
    super();
    this.options = Object.assign(defaultOptions, options);

    for (const signal of signals) {
      this.addSignal(`kanban:${signal}`);
    }

    this.kanban = document.querySelector(this.options.selector);
    const draggables = this.kanban.querySelectorAll(this.options.dragSelector);
    const droppables = this.kanban.querySelectorAll(this.options.dropSelector);

    draggables.forEach((draggable) => {
      draggable.addEventListener('mousedown', this.#dragStart);
      draggable.addEventListener('mousemove', this.#dragOver);
      document.addEventListener('mouseup', this.#dragEnd);
      document.addEventListener('mousemove', this.#move);
    });

    droppables.forEach((droppable) => {
      droppable.addEventListener('mouseover', this.#dropOver);
      droppable.addEventListener('mouseleave', this.#dropLeave);
    });
  }

  #dragStart = (event) => {
    if (event.button !== 0) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    const rect = event.target.getBoundingClientRect();
    this.drag = {
      id: event.target.id,
      status: event.target.closest('.column--tasks').dataset.status,
      element: event.target,
      initialPosition: {
        x: rect.top,
        y: rect.left,
      },
    };
    event.target.classList.add('dragged');
    event.target.style.top = `${rect.top}px`;
    event.target.style.left = `${rect.left}px`;
    event.target.style.width = `${rect.width}px`;
    event.target.style.height = `${rect.height}px`;
  };

  #dragEnd = (event) => {
    if (!this.drag) {
      return;
    }

    const dropRegion = event.target.closest(this.options.dropSelector);
    if (dropRegion && this.drop.accepted) {
      this.ghost.element.after(this.drag.element);
      const ranks = [...dropRegion.querySelectorAll(this.options.dragSelector)].map((dragElement) => dragElement.id);
      this.emit('kanban:moved', {
        id: this.drag.id,
        status: this.drop.status,
        ranks,
      });
    }

    this.drag.element.classList.remove('dragged', 'dragged-refused');
    this.drag.element.style.removeProperty('left');
    this.drag.element.style.removeProperty('top');
    this.drag.element.style.removeProperty('width');
    this.drag.element.style.removeProperty('height');
    delete this.drag;
    this.#resetGrants();
    this.#removeGhost();
  };

  #dragOver = (event) => {
    if (!this.drag) {
      return false;
    }
    if (event.target.id === this.drag.element.id) {
      return;
    }

    this.#createGhost();
    const rect = event.target.getBoundingClientRect();
    const top = event.clientY - rect.top < rect.height / 2;
    if (top) {
      event.target.before(this.ghost.element);
    } else {
      event.target.after(this.ghost.element);
    }
  };

  #move = (event) => {
    if (!this.drag) {
      return;
    }
    const rect = this.drag.element.getBoundingClientRect();
    const newX = event.pageX - rect.width / 2;
    const newY = event.pageY - rect.height / 2;
    this.drag.element.style.left = `${newX}px`;
    this.drag.element.style.top = `${newY}px`;
    this.drag.element.classList.toggle(
      'dragged-refused',
      !(this.drop && this.drop.accepted)
    );
  };

  #dropOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!this.drag || !event.target.dataset.accepts) {
      return;
    }
    const accepted = this.#accepts(
      event.target.dataset.accepts.split(';'),
      event.target.dataset.status
    );
    event.target.classList.toggle('accepted', accepted);
    event.target.classList.toggle('refused', !accepted);
    this.drop = {
      accepted,
      status: event.target.dataset.status,
    };

    if (accepted && !event.target.querySelector('.ghost')) {
      this.#removeGhost();
      this.#createGhost();
      const lastOne = event.target.querySelector('.kanban--task:last-child');
      if (lastOne) {
        lastOne.after(this.ghost.element);
      }
    }
  };

  #dropLeave = (event) => {
    event.target.classList?.remove('accepted');
    event.target.classList?.remove('refused');
    if (event.target.querySelector('.ghost')) {
      this.#removeGhost();
    }
  };

  #accepts(acceptedStatuses, status) {
    if (!this.drag) {
      return false;
    }
    const draggedStatus =
      this.drag.element.closest('[data-status]').dataset.status;
    return [...acceptedStatuses, status].includes(draggedStatus);
  }

  #createGhost = () => {
    if (!this.ghost) {
      this.ghost = {};
      this.ghost.element = document.createElement('article');
      this.ghost.element.classList.add('kanban--task', 'ghost');
      this.ghost.element.innerText = 'Here ?';
    }
  };

  #removeGhost = () => {
    if (this.ghost) {
      this.ghost.element.remove();
      delete this.ghost;
    }
  };

  #resetGrants = () => {
    document
      .querySelector(this.options.selector)
      .querySelectorAll('.accepted')
      .forEach((a) => a.classList.remove('accepted'));
    document
      .querySelector(this.options.selector)
      .querySelectorAll('.refused')
      .forEach((a) => a.classList.remove('refused'));
  };

}
