# HTTP Transport

### Motivation
The reason that I have created this repo is because it seems like the default http transport is lacking some of the functionality that I have needed, like sending http requests to a destination where only the url is known.
You can check more about it in `https://github.com/winstonjs/winston/issues/1770`

### Example
```javascript
import {createLogger, HttpTransport} from "some-folder-with-transport";
const loggerOptions = {
    transports: [
        new HttpTransport('http://some-other-host:3000/api/v1/test'),
        new HttpTransport({
            host: 'localhost',
            port: 3000,
            path: '/api/v1/test',
            ssl: true
        })
    ]
};
const logger = createLogger(loggerOptions);
logger.error('Something has failed')
```
The logger above will send logs to the following places:
- To the console (by default)
- to `http://some-other-host:3000/api/v1/test` (defined in the first transport)
- to `https://localhost:3000/api/v1/test` (defined in the second transport)

----------------

### TODOs:

- Add option for batching logs instead of sending a request for each log.
