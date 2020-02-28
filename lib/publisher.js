'use strict';

const { promisify } = require('util');
const debug = require('debug')('qstream:publisher');

const parseMaxLen = (maxLen) => {
    if (Number.isInteger(maxLen)) {
        return maxLen.toString();
    }
    if (typeof maxLen === 'string' && maxLen.startsWith('~')) {
        const n = maxLen.replace('~', '');
        if (Number.isInteger(Number(n))) {
            return ['~', n]
        }
    }
    throw new Error('Invalid maxLen value, should be integer or a string like this: "~n"')
}

module.exports = (redis) => {

    const xadd = promisify(redis.xadd).bind(redis);

    const publish = async (STREAM_NAME, ENTRY=null, maxLen) => {

        if(!ENTRY) {
            throw new Error('Publish need a topic and an entry, publish("topic", "entry")');
        }

        debug('Publishing....', ENTRY);

        return xadd(
            [ STREAM_NAME ]
            .concat(maxLen ? ['MAXLEN'].concat(parseMaxLen(maxLen)) : [])
            .concat(['*', 'ENTRY', JSON.stringify(ENTRY)])
        );
    };

    return publish;
};
