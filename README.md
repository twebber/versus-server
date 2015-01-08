### Versus Game Server

API server for the Versus Games platform. Data backend is MongoDB. Cache server is Redis. Web server is Express 4.

Notifications are via websockets, email (Mandrill) and sms (Twilio).

## Prerequisites

Node.js

Npm

MongoDB

Redis

## Installation

> npm install

## Run

> npm start

To run the server as a cluster:

> node cluster

To run just the background workers:

> node bootstrap --app:worker

To run just scheduled jobs:

> node bootstrap --app:schedule

## Test

> npm test

## Tasks

There are a couple of tasks to be run to setup the local data store. To seed the database:

> node tasks/seed

To clean the data store:

> node tasks/clean

## Code Organisation

Server code is in ```lib```. All resources (HTTP APIs) are in ```lib/apps```. Cross-cutting concerns are under ```lib```. These include wrapper to social APIs (just Facebook for the moment), redis, caching, email, sms, the data store, scheduling, logging, queueing.

Winston is used for logging. Cron is used for scheduling jobs. Monk is the MongoDB module. Socket.io is used for websockets. Nconf is for configuration. Configuration files are in the ```config``` folder. Mocha is used for testing. Elastic Search is the indexing server.

Each 'app' is organised into several folders:

* *Repositories* contain data access repositories for the main entities.

* *Resources* contain the API handler code.

* *Services* are the business logic for the system.

* *Consumers* are for background workers.

* *Jobs* contain scheduled jobs (none as yet).

## Server API

```
/games
/matches
```