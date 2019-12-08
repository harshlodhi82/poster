## Tests

Test framework is `tape`. See documentation https://www.npmjs.com/package/tape#tplann

## Running tests
```
npm test
```
or 
```
npm test libExample
```

Do not turn off of modify tests to make them pass (unless the test is incorrect). If a test is incorrect or has a bug, let me know.

## How to organize files

```
lib
  libOne
    index.js
    libOne.test.js
    utils.js
    utils.test.js
  libTwo
  libThree
```

See example inside /lib/exampleLib. Keep all your files in a single lib. Use subfiles and subfolders if needed.

## Logging

Do not use console.log, use

```
const log = require('lib/utils/logger')
log.info('hello')
```

## Linting

Do not disable linting or change rules. Can add `// eslint-disable-next-line` when no other option.

## Dependencies

Do not add unececessary npm modules. If the function needed is small, copy it into your code. If you must add a dependency, for example `csv`, you should ask me first because I might prefer one module over another.

## Style

- Always use async await over callbacks/.then
- Always use const/let over var
- Awalys use arrow functions
- Always use destructuring, e.g.:
	- `const saveAccountToFile = ({username, age, location, firstName, lastName} = {}) => {...}`
	- `function send({message, recipient, sender} = {}) {...}`
	- `const {username, password} = account`
- Do not use more than 2 arguments in a function, use a destructured object instead
- Keep functions small, pure, and make them do 1 thing
- Name functions and variables very descriptively, e.g.:
  - `let number = 7` over `let n = 7`
  - `getUsernameFromAccount()` over `getUsername()`
  - `accountId` over `id`
  - `rowIndex` over `row`
  - `rowCount` over `rows`
