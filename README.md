# KApisix - King for [Apisix API Gateway](https://apisix.apache.org)

King UI companion for Apisix API Gateway.

[![KApisix graph view](https://raw.githubusercontent.com/ligreman/king-for-apisix/main/docs/images/shot_1.jpg)](https://ligreman.github.io/king-for-apisix)

[![KApisix details](https://raw.githubusercontent.com/ligreman/king-for-apisix/main/docs/images/shot_2.jpg)](https://ligreman.github.io/king-for-apisix)

_KApisix is not official, and does not have any affiliation with [Apisix](https://apisix.apache.org)._

## Summary

- [**Features**](#features)
- [**Compatibility**](#compatibility)
- [**Prerequisites**](#prerequisites)
- [**Installation**](#installation)
- [**Configuration**](#configuration)
- [**Development**](#development)
- [**Author**](#author)

## Features

* Overview an Apisix deployment in an interactive graph interface.
* Use Apisix Control API. No connection needed to the Admin Api.

## Compatibility

KApisix has been developed to be compatible with Apisix API Gateway 3.12.x version and newer. It may be compatible backwards, but it has not been tested.

## Prerequisites

- An [Apisix API Gateway](https://docs.Apisixhq.com) instance running.
- A NodeJS server.

## Installation

### Docker

KApisix is distributed as Docker images. You cand find them in the packages of this repository.

### Generate your own Docker image

Just can just use the Dockerfile included to generate a Docker image. This way you can make changes into the project and build your own image.

`docker build -t "NAME:Dockerfile"`


### Manual installation

Download the latest `.zip` [release package](https://github.com/ligreman/king-for-apisix/releases), and unzip it.

Configure both the api and the frontend components (read the [**Configuration**](#configuration) section).

Download dependencies:

1. Go into the `api` folder.
2. Execute `npm install`. 
3. Go into the `frontend` folder.
4. Execute `npm install` and then `npm build`.

Copy all the contents inside the `api` folder (it should already contains the built frontend in the www folder), to a server with NodeJS installed.

Start the server with `npm start`. You probably should consider using a NodeJS process manager like Nodemon, PM2 or a general one like dumb-init.


## Configuration

### Api component variables

Create an environment variable with the Apisix Control Api url, called `APISIX_API`.

`export APISIX_URL="http://apisix:port/control-api"`

### Frontend component variables

In the Frontend just check that the Api url variable is set pointing to the KApisix Api url. Also set the Apisix Control Api url variable.

```
# File globals.service.ts
private _API_URL = 'http://localhost:3000/api';

# Point this to Apisix Control Api url
private _APISIX_URL = 'http://apisix:port/control-api';
```

## Development

### Prepare environment

Install NodeJS version >= 20. [Official NodeJS installation instructions](https://nodejs.org/en/download).

Clone the repository to your local machine and install npm dependencies both for the api and the frontend:

```
git clone https://github.com/ligreman/king-for-apisix.git
cd king-for-apisix/api
npm install

cd ../frontend
npm install
```

Configure the variables following the [**Configuration**](#configuration) section.

### Running

You must start the Api component and the Frontend. each of them have their own package.json file with a `start`script.

```
# Api
cd api
npm start

# Frontend
cd frontend
npm start
```

KApisix will be available at `http://localhost:4200`

### How to upgrade

To upgrade Angular and Angular Material libraries, use the `npx` tool included with Angular. Example:

`npx @angular/cli@13 update @angular/core@13 @angular/cli@13 --force`

`npx @angular/cli@13 update @angular/material@13 --force`

Always follow the official [upgrade guides](https://angular.dev/update-guide).

## Author

[Ligreman (LigreSoftware)](https://ligreman.com)

*https://ligreman.github.io/king-for-apisix*
