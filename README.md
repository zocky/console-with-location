# console-with-location

Drop-in replacement for Node.js `console.*` that adds **colour** and **caller location** to every log line.

```js
import 'console-with-location';   // ← that’s it

console.log('hello');             // cyan text + “  at /full/path/file.js:7”
console.error({oops: true});      // red text + same grey suffix
```

## Install

```bash
npm install console-with-location
```

## Usage

Just import (or require) once **before** any other code:

ESM
```js
import 'console-with-location';
```

CommonJS
```js
require('console-with-location');
```

After that every call to `console.log`, `.info`, `.warn`, `.error`, `.debug` (and all the other methods) will:

* colour string arguments only (objects and other values will be colored with util.inspect)  
* append a grey line such as `  at /home/you/project/src/index.js:42`  

No colors are applied for non-TTY streams and if 'NO_COLOR' or 'CI' environment variables are set.

## Colour rules

| method  | color   |
|---------|---------|
| log     | cyan    |
| info    | green   |
| debug   | yellow  |
| error   | red     |
| warn    | orange  |

Disable colours at any time:

```bash
NO_COLOR=1 node index.js
```

## License

MIT
