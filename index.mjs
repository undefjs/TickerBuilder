// @ts-check
'use strict';

/**
 * @typedef Tick
 * @property {number} id
 * @property {number} time
 * @property {number} open
 * @property {number} high
 * @property {number} low
 * @property {number} close
 */

/**
 * Calculates the timestamp of the tick based on the interval.
 * @param {number} intervalMs - The interval in milliseconds.
 * @param {number} ts - The timestamp to calculate the tick timestamp from.
 * @returns {number} - The calculated tick timestamp.
 */
const calculateTickTimestamp = (intervalMs, ts) => {
  return ts - (ts % intervalMs);
}

export default class TickerBuilder {
  /**
   * Constructs a new TickerBuilder with the specified interval.
   * @param {number} interval - The interval in seconds.
   */
  constructor(interval) {
    this.tickerData = [];
    this.ticksGrouped = {};
    this.intervalMs = interval * 1000;
    this.tickStartTs = calculateTickTimestamp(this.intervalMs, Date.now());
  }

  /**
   * Adds a tick to the TickerBuilder.
   * @param {number} ts - The timestamp of the tick.
   * @param {number} val - The value of the tick.
   */
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

  /**
   * Converts the tick data to an array of ticks.
   * @returns {Tick[]} - The array of ticks.
   */
  toTicker() {
    const ticker = [];

    let first = true;
    for(const [ _ts, ticks ] of Object.entries(this.ticksGrouped)) {
      const ts = Number(_ts);
      const id = Math.floor((ts - this.tickStartTs) / this.intervalMs);
      const time = Math.floor(ts / 1000);
      const open = (first ? (first = false, ticks[0]) : ticker.at(-1)?.close);
      const high = Math.max(open, ...ticks);
      const low = Math.min(open, ...ticks);
      const close = ticks.at(-1);
      
      ticker.push({ id, time, open, high, low, close });
    }

    return ticker;
  }

  /**
   * Gets the complete ticker data including previously added ticks.
   * @returns {Tick[]} - The array of ticks.
   */
  getTicker() {
    return [ ...this.tickerData, ...this.toTicker() ];
  }
}
