# HTTP Transport

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

# TODOs:

- Add option for batching logs instead of sending a request for each log.
