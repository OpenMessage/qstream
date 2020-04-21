'use strict';

const test = require('ava');
const Redis = require('redis');

const qstream = require('../lib');

test('create instance no arguments', async t => {
    t.plan(1)

    const instance = qstream();

    t.truthy(instance.redis instanceof Redis.RedisClient);
});

test('create instance url argument', async t => {
    t.plan(1)

    const instance = qstream('redis://randomhost:6379');

    t.truthy(instance.redis instanceof Redis.RedisClient);
});

test('create instance with redisClient', async t => {
    t.plan(1)

    const redisClient = Redis.createClient();
    const instance = qstream({ redisClient });

    t.truthy(instance.redis instanceof Redis.RedisClient);
});
