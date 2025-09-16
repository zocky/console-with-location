import { fileURLToPath } from 'node:url';
import util from 'node:util';

const color256 = (code, txt) => `\x1b[38;5;${code}m${txt}\x1b[0m`;

const colors = process.stdout.isTTY && !process.env.NO_COLOR && !process.env.CI;

const green = !colors
  ? t => t
  : t => color256(46, t);

const orange = !colors
  ? t => t
  :  t => color256(208, t);

const grey = !colors
  ? t => t
  : t => color256(247, t);

const cyan = !colors
  ? t => t
  : t => color256(51, t);

const red = !colors
  ? t => t
  : t => color256(196, t);

const yellow = !colors
  ? t => t
  :  t => color256(226, t);



const patchLogger = (name, color) => {
  console[name] = (format, ...args) => {
    if (typeof format === 'string' && format.match(/%[ssifjoOc%]/)) {
      // it's formatted, so leave it to util.format
      const msg = util.formatWithOptions({ colors }, format, ...args);
      process.stdout.write(msg);
    } else {
      // it's not formatted, so let's color the strings and leave the rest to util.inspect
      const msg = [format, ...args].map(
        it => typeof it === 'string'
          ? color(it, it)
          : util.inspect(it, { colors })
      ).join(' ');
      process.stdout.write(msg);
    }
    writeCallerInfo();
  };
};

const patchOther = (name) => {
  const fn = console[name];
  return (...args) => {
    fn(...args);
    writeCallerInfo();
  }
};

patchLogger('log', cyan);
patchLogger('info', green);
patchLogger('debug', yellow);
patchLogger('error', red);
patchLogger('warn', orange);
patchOther('table');
patchOther('trace');
patchOther('dir');
patchOther('dirxml');
patchOther('group');
patchOther('groupCollapsed');
patchOther('groupEnd');
patchOther('profile');
patchOther('profileEnd');
patchOther('time');
patchOther('timeEnd');
patchOther('count');
patchOther('assert');
patchOther('clear');
patchOther('countReset');
patchOther('markTimeline');
patchOther('timeStamp');
patchOther('timeline');
patchOther('timelineEnd');
patchOther('timelineEnd');


function writeCallerInfo(skip = 3) {
  const err = new Error();
  // Extract the stack trace and skip the first 3 lines (Error and this function and this function's caller)
  const stackLines = err.stack.split('\n');
  const callerLine = stackLines.length > skip ? stackLines[skip].trim() : '';

  // Parse the file path and line number
  const match = callerLine.match(/\((.*):(\d+):(\d+)\)$/);
  let callerInfo = 'Unknown';
  if (match) {
    const fileUrl = match[1];
    let filePath;
    try {
      filePath = fileURLToPath(fileUrl);
    } catch (e) {
      filePath = fileUrl;
    }
    const line = match[2];
    callerInfo = `${filePath}:${line}`;
  }
  process.stdout.write(grey('  at ' + callerInfo) + '\n');
}

