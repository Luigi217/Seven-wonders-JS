const EventEmitter = require('events');

class Units {
  constructor(stance, timeFactor) {
    this.alive_ = true;
    this.wounded_ = false;
    this.combatMode_ = stance;
    this.ageMax_ = 30; // 5 secondes
    this.worldEvents_ = new EventEmitter();
    this.timeFactor_ = timeFactor || 1000;
  }

  init() {
    this.willDie_ = setTimeout(() => {
      this.alive_ = false;
    }, this.ageMax);
  }

  sentToWar() {
    if (this.combatMode === 'defense') {
      this.worldEvents.emit('woundedInDefense', {
        wounded: true
      });
    } else {
      const x = Math.random();
      if (x > 0.2 && x < 0.60) {
        this.worldEvents.emit('woundedInCombat', {
          wounded: true
        });
      }

      if (x > 0.80) {
        this.worldEvents.emit('deadInCombat', {
          alive: false
        });
      }
    }
  }

  get isAlive() {
    return this.alive_;
  }

  get isWounded() {
    return this.wounded_;
  }

  get worldEvents() {
    return this.worldEvents_;
  }

  get name() {
    return this.name_;
  }

  get timeFactor() {
    return this.timeFactor_;
  }

  deathOfUnit() {
    clearInterval(this.willDie_);
  }

  get combatMode() {
    return this.combatMode_;
  }

  get ageMax() {
    return this.ageMax_;
  }
}

module.exports = {Units};
