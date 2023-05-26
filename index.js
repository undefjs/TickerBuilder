'use strict';

function calculateTickTimestamp(intervalMs, ts) {
  return ts - (ts % intervalMs);
}

class TickerBuilder {
  constructor(interval) {
    this.tickerData = [];
    this.ticksGrouped = {};
    this.intervalMs = interval * 1000;
    this.tickStartTs = calculateTickTimestamp(this.intervalMs, Date.now());
  }
  
  add(ts, val) {
    const tickTs = calculateTickTimestamp(this.intervalMs, ts);
    
    if(this.ticksGrouped[tickTs]) {
      this.ticksGrouped[tickTs].push(val);
    }
    else { //first tick in this candle, compound until this one
      this.tickerData = this.getTicker();
      this.ticksGrouped = { [tickTs]: [val] };
    }
    
  }
  
  toTicker() {
    const ticker = [];
    
    let first = true;
    for(const [ _ts, ticks ] of Object.entries(this.ticksGrouped)) {
      const ts = Number(_ts);
      const id = Math.floor((ts - this.tickStartTs) / this.intervalMs);
      const time = Math.floor(ts / 1000);
      const open = (first ? (first = false, ticks[0]) : ticker.at(-1).close);
      const high = Math.max(open, ...ticks);
      const low = Math.min(open, ...ticks);
      const close = ticks.at(-1);
      
      ticker.push({ id, time, open, high, low, close });
    }
    
    return ticker;
  }
  
  getTicker() {
    return [ ...this.tickerData, ...this.toTicker() ];
  }
}

module.exports = TickerBuilder;
