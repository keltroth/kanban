const handlerSymbol = Symbol.for('handler');

export class Emitter {
  [handlerSymbol];

  addSignal = (signal) => {
    this[handlerSymbol].set(signal, []);
  };

  constructor() {
    this[handlerSymbol] = new Map();
  };

  on = (signal, callback) => {
    if (!this[handlerSymbol].get(signal)) {
      throw new Error(
        `[kanban] Signal '${signal}' unknown (use one of these [${[
          ...this[handlerSymbol].keys(),
        ]}])`
      );
    }
    this[handlerSymbol].get(signal).push(callback);
  };

  emit = (signal, data) => {
    for (const handler of this[handlerSymbol].get(signal)) {
      handler(data);
    }
  };
}
