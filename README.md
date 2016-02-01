#node-event-hub-stream

A simple Azure Event Hub client that exposes a Stream interface for use in Bunyan logging or anything else accepting a Stream interface(write(), close())

## Install

    npm install node-event-hub-stream

## Usage

Below is an example used with Bunyan, but the 'eventStream' variable could be passed to anything accepting a Stream interface, which contains write(string) and close() signatures.

    var bunyan = require('bunyan');
    var eventHub = require('event-bus-stream');

    var namespace = '<ServiceBus Namespace>';
    var hubName = '<EventHub name>';
    var saName = '<Shared Access Policy name>';
    var saKey = '<Shared Access Policy key>';

    function modificationFunc(obj) {
        // Change the incoming object before its sent.
        // Example: Add a unique id to the object
        // But realize the incoming object may be immutible, so you may
        return obj
    }

    var streamClient = eventHub.restClient(namespace, hubName, saName, saKey, modificationFunc);

    var log = bunyan.createLogger({
        name: '<Logger_Name_Here>',
        streams: [
            {level: 'info', stream: streamClient}
    });

    module.exports = log;
    
## How it works

Currently the code is using Azure Event Hub's REST api. It should be possible to extend it to use ampq, but I have not looked into it.

## Attributions

A good deal of this code is copied from the event-hub-client repository, so thanks to @noodlefrenzy

https://github.com/noodlefrenzy/event-hub-client/

## License

Apache 2.0