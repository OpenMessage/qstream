'use strict';

const Redis = require('redis');
const debug = require('debug')('qstream:main');

const publisher = require('./publisher');
const grouper = require('./grouper');

// TODO Implement unacked logic
// const xclaim = promisify(redis.xclaim).bind(redis);
// const xpending = promisify(redis.xpending).bind(redis);

// TODO implement single/simple subscribe with no queuing/grouping
// const xread = promisify(redis.xread).bind(redis);

// TODO implement analytics
// const xinfo = promisify(redis.xinfo).bind(redis);

module.exports = (...connectionArgs) => {

    const [{ redisClient } = {}] = connectionArgs;

    const redis = redisClient || Redis.createClient(...connectionArgs);

    redis.on('error', (error) => {
        debug('error', { error });
        throw error;
    });

    redis.on('ready', () => {
        debug('redis ready');
    });

    const publish = publisher(redis);
    const group = grouper(redis, connectionArgs);

    return {
        group,
        publish,
        redis
    }

};

