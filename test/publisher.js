'use strict';

const test = require('ava');

const publisher = require('../lib/publisher')

test('publish', async t => {
    t.plan(1)
    const redis = {
        xadd: (command, cb) => cb(null, command) 
    }
    const publish = publisher(redis)

    const commandArgs = await publish('a-stream', { a: 1 })

    t.deepEqual(commandArgs, ['a-stream', 'MAXLEN', '~', '10000','*', 'ENTRY', '{"a":1}'])
});

test('publish disabling maxLen', async t => {
    t.plan(1)
    const redis = {
        xadd: (command, cb) => cb(null, command) 
    }
    const publish = publisher(redis)

    const commandArgs = await publish('a-stream', { a: 1 }, null)

    t.deepEqual(commandArgs, ['a-stream', '*', 'ENTRY', '{"a":1}'])
});


test('publish with maxlen', async t => {
    t.plan(1)
    const redis = {
        xadd: (command, cb) => cb(null, command) 
    }
    const publish = publisher(redis)

    const commandArgs = await publish('a-stream', { a: 1 }, 10)

    t.deepEqual(commandArgs, ['a-stream', 'MAXLEN', '10', '*', 'ENTRY', '{"a":1}'])
});

test('publish with approximated maxlen', async t => {
    t.plan(1)
    const redis = {
        xadd: (command, cb) => cb(null, command) 
    }
    const publish = publisher(redis)

    const commandArgs = await publish('a-stream', { a: 1 },'~10')

    t.deepEqual(commandArgs, ['a-stream', 'MAXLEN', '~', '10', '*', 'ENTRY', '{"a":1}'])
});
