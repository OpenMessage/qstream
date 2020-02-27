'use strict';

const { promisify } = require('util');
const debug = require('debug')('qstream:publisher');

module.exports = (redis) => {

    const xadd = promisify(redis.xadd).bind(redis);

    const publish = async (STREAM_NAME, ENTRY=null, extraArgs={}) => {

        if(!ENTRY) {
            throw new Error('Publish need a topic and an entry, publish("topic", "entry")');
        }

        debug('Publishing....', ENTRY);

        const maxLen = extraArgs.maxLen ? ['MAXLEN'].concat(extraArgs.maxLen) : [];

        return xadd(
            [ STREAM_NAME ]
            .concat(maxLen).map((v) => v.toString())
            .concat(['*', 'ENTRY', JSON.stringify(ENTRY)])
        );
    };

    return publish;
};
