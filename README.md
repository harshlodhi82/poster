## Files are in `poster/lib/`
#### Install (tested with node version 12)
```
cd poster
npm install
```
## Tests

Test framework is `jest`. See documentation https://www.npmjs.com/package/jest

## Running tests
```
cd poster
npm test
```
or just one file (replace fileName with the file name)
```
cd poster
npm test fileName
```
in docker
```
bin/run npm install
bin/run npm test fileName
```

Do not turn off of modify tests to make them pass (unless the test is incorrect). If a test is incorrect or has a bug, let me know.

For the task to be complete it must pass the flaky test suite
```
cd poster
npm run test:flaky fileName
```

## Linting & typescript

Do not disable linting or change eslint/typescript rules. Can add `// eslint-disable-next-line` or `// @ts-ignore` when needed.

## Dependencies

Do not add unececessary npm modules. If the function needed is small, copy it into your code. If you must add a dependency, for example `csv`, you should ask me first because I might prefer one module over another.

## Style

- No commented out code in pull requests
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
- use `import` over `require`

## Logging

Do not use console.log, use

```
import log from 'lib/utils/logger'
log.info('hello')
```

## How to organize files

If code gets too big in one file, split it into 2 files inside the same folder. Do not create more folders or files outside the folder.

## Wordpress tests

Must have docker running:
```
bin/wp-bash
```
This will build wordpress images and give a shell inside the container with a wordpress site at url `http://wordpress-test/site-1/` (only accessible inside the container)
```
npm install
npm test wordpress
```

## How to submit work

Do not send work in text files in messenger for review. Send a pull request as shown in this video https://www.youtube.com/watch?v=rgbCcBNZcdQ
