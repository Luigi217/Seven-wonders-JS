const EventEmitter = require('events');

class Boat {
  constructor(name, timeFactor) {
    this.name_ = name || 'UNKBOAT';
    this.wood_ = 1000;
    this.worldEvents_ = new EventEmitter();
    this.timeFactor_ = timeFactor || 1000;
  }

  init() {
    this.finding = setInterval(() => {
      if (Math.random() > 0.80) {
        this.wood_ += 1000;
      }
      if (Math.random() > 0.95) {
        this.worldEvents.emit('treasure', {
          gold: 5000
        });
      }
    }, this.timeFactor);

    this.meeting = setInterval(() => {
      // Un donnateur
      if (Math.random() > 0.5) {
        this.wood_ += 500;
      }

      // Des putes de Mer
      if (Math.random() > 0.65) {
        this.wood_ -= 300;
        this.checkIfAlive();
      }

      // Le kraken
      if (Math.random() < 0.03) {
        this.wood_ -= 10000;
        this.checkIfAlive();
      }
    }, this.timeFactor);
  }

  checkIfAlive() { // Check if boat still alive
    if (this.wood <= 0) {
      clearInterval(this.finding);
      clearInterval(this.meeting);
    }
  }

  get wood() {
    return this.wood_;
  }
}

module.exports = {Boat};
