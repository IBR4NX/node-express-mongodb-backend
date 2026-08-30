import time from './time.js';

function printStart() {
  console.clear();
  console.log(
    `\x1b[33m#`.repeat(18),
    `\x1b[32 begin ${time()}`,
    `\x1b[33m#\x1b[0m`.repeat(18)
  );
}
export default printStart();
printStart();
