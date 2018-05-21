const EventEmitter = require('events');
const {Divinity} = require('./divinity');
const {Units} = require('./units');
const {Boat} = require('./boat');

class City {
  constructor(name, nameDivinity, unitNumber, timeFactor) {
    this.name_ = name || 'UNKCITY';
    this.corn_ = 1000;
    this.gold_ = 1000;
    this.boat_ = new Boat('Black Pearl', 1);
    this.divinity = new Divinity(nameDivinity, timeFactor);
    this.unitNumber = unitNumber;
    this.unitList = new Array(unitNumber);
    this.worldEvents_ = new EventEmitter();
    this.timeFactor_ = timeFactor || 1000;
  }

  init() {
    this.divinity.init();
    this.boat_.init();

    this.urrukInterval_ = setInterval(() => {
      if (Math.random() > 0.20) {
        this.worldEvents.emit('trade', {
          corn: 100
        });
        this.gold_ += 100;
      } else {
        this.worldEvents.emit('dead', {
          corn: 0
        });
      }
      this.corn_ -= 100;
    }, this.timeFactor);

    this.smite_ = setInterval(() => {
      this.divinity.offeringCorn(this.corn_ / 10);
      this.divinity.offeringGold(this.gold_ / 10);
      this.corn_ = 0.90 * this.corn;
      this.gold_ = 0.90 * this.gold;
    }, this.timeFactor * 5);

    this.disaster_ = setInterval(() => {
      // Famine
      if (Math.random() < 0.03) {
        this.corn_ = this.corn * 0.75;
      }

      // Storm
      if (Math.random() < 0.08) {
        this.gold_ = this.gold * 0.85;
      }

      // Resto du coeur - 1 fois par an
      if (Math.random() < 1 / 365) {
        this.corn_ = this.corn * 0.99;
        this.gold_ = this.gold * 0.99;
      }
    }, this.timeFactor);

    for (let i = 0; i < this.unitNumber; i++) {
      this.unitList.push(new Units('Attack', 1));
    }

    this.divinity.worldEvents.on('blessing', blessing => {
      this.gold_ += blessing.gold;
      this.corn_ += blessing.corn;
    });

    this.divinity.worldEvents.on('favor', favor => {
      this.gold_ += favor.gold;
      this.corn_ += favor.corn;
    });

    this.boat_.worldEvents().on('treasure', treasure => {
      this.gold_ += treasure.gold_;
    });
  }

  checkIfAlive() {
    this.unitList.forEach((element, index) => {
      if (!element.isAlive) {
        this.unitList.splice(index, 1);
      }
    });
  }

  goToWar() {
    this.unitList.forEach(element => {
      element.sentToWar();
    });
    this.checkIfAlive();
  }

  get worldEvents() {
    return this.worldEvents_;
  }

  get corn() {
    return this.corn_;
  }

  get gold() {
    return this.gold_;
  }

  get name() {
    return this.name_;
  }

  get timeFactor() {
    return this.timeFactor_;
  }

  endWorld() {
    clearInterval(this.urrukInterval_);
    clearInterval(this.smite_);
    clearInterval(this.disaster_);
  }
}

module.exports = {City};
