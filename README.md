# TickerBuilder

```js
import TickerBuilder from './TickerBuilder';

// Create a new TickerBuilder instance with an interval of 5 seconds
const tickerBuilder = new TickerBuilder(5);

// Add ticks to the TickerBuilder
tickerBuilder.add(Date.now() - 4000, 10);
tickerBuilder.add(Date.now() - 3000, 15);
tickerBuilder.add(Date.now() - 2000, 8);
tickerBuilder.add(Date.now() - 1000, 12);
tickerBuilder.add(Date.now(), 16);

// Get the complete ticker data
const tickerData = tickerBuilder.getTicker();

// Print the ticker data
console.log(tickerData);
```
