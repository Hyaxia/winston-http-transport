import axios from 'axios'
import {createLogger, LogEntry, Logger, transports, format} from 'winston';
import Transport from 'winston-transport';

/**
 * Options to pass to our custom made http constructor
 */
interface HttpTransportOpts {
    host: string
    port: number
    path: string
    /**
     * If https is needed set to true
     */
    ssl?: boolean
}

/**
 * This class was created due to the fact that the default HTTP transport
 * does not handle a case when a full url is passed to it, which is sometimes
 * the case when trying to access different micro-services on openshift.
 */
class HttpTransport extends Transport {
    /**
     * The url that is used when sending the log
     */
    readonly url: string;
    /**
     * As with the logger, this is the minimum log level of any log that will be outputted
     */
    readonly level: string;
    /*
    This logger will be used only inside the transport, when things go bad
    */
    private readonly innerLogger: Logger

    /**
     * Receives the options passed and returns the url constructed from them
     * @param opts: holds the needed data to construct the url
     */
    private assembleUrl(opts: HttpTransportOpts) {
        let httpPrefix = opts.ssl ? 'https://' : 'http://';
        let path = opts.path[0] === '/' ? opts.path : '/' + opts.path;
        return httpPrefix + opts.host + ':' + opts.port + path;
    }

    /**
     * Can pass to the constructor either a full url as a string,
     * or an `CprHttpOpts` object
     * @param opts: either string or a `HttpTransportOpts` object to initialize the transport
     * @param level: the level that the transport should operate in
     */
    constructor(opts: HttpTransportOpts | string, level?: string) {
        super();
        this.url = typeof opts === 'object' ? this.assembleUrl(opts) : opts;
        this.level = level ? level : 'info';
        this.innerLogger = createLogger({
            transports: [new transports.Console({
                format: format.combine(
                    format.colorize(),
                    format.timestamp()
                )
            })]
        })
    }

    /**
     * Preforms a POST HTTP request to the needed url
     * @param data: data to send with the POST request
     */
    private request(data: LogEntry) {
        return axios.post(this.url, data)
    }

    /**
     * Called when we want to perform a log.
     * Winston loggers know when to call this method to perform the logging
     *
     * @param info: the data we want to log
     * @param next: next
     */
    log(info: LogEntry, next: () => void): any {
        this.request(info)
            .then(() => {
                this.emit('logged', info);
            })
            .catch(error => {
                const errData = {
                    message: error.toString(),
                    url: this.url,
                    source: 'Originated from transport HttpTransport\'s log method'
                };
                this.innerLogger.warn(errData);
            });
        next();
    }
}

export {
    HttpTransport,
    HttpTransportOpts
}

