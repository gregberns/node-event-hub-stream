'use strict';

/* global process */

var request = require('request');
var saToken = require('./saToken');

/**
 * Creates a new EventHub REST Client.
 *
 * @param {string} namespace    The ServiceBus Namespace to use.
 * @param {string} hubName      The EventHub name.
 * @param {string} saName       The Shared Access Policy name.
 * @param {string} saKey        The Shared Access Policy key.
 * @param {function} modFxn     A function that can modify the object to be written.
 */

function EventBusStream(namespace, hubName, saName, saKey, modFxn) {
	this.token = saToken.create(namespace, hubName, saName, saKey);
	this.namespace = namespace;
	this.hubName = hubName;
	this.serviceBusUriSuffix = '?timeout=60&api-version=2014-01';
    if (typeof modFxn !== 'function') {
        throw new Error('The ModificationFunction parameter must be a function, and is of type: ' + typeof modFxn);   
    }
    this.modFxn = modFxn;
}

EventBusStream.prototype.getRequest = function () {
	let uri = 'https://' + this.namespace + '.servicebus.windows.net/' +
		this.hubName + '/messages' + this.serviceBusUriSuffix;
	return {
		uri: uri,
		method: 'POST',
		headers: {
			'Content-Type': 'application/atom+xml;type=entry;charset=utf-8',
			'Authorization': this.token
		},
		body: null
	};
};

EventBusStream.prototype.write = function (obj) {
	let req = this.getRequest();
    
    if (this.modFxn) {
        req.body = JSON.stringify(this.modFxn(obj));
    } else {
        req.body = JSON.stringify(obj);
    }
    
	request(req, function (err) {
		if (err) {
			console.info('EventBusStream - Write - Failed');
			console.error(JSON.stringify(err));
		}
	});
};

EventBusStream.prototype.close = function () {};

module.exports.create = function (namespace, hubName, saName, saKey, modificationFunc) {
	return new EventBusStream(namespace, hubName, saName, saKey, modificationFunc);
};
