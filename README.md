# Blockchain network demonstrator

This software is a simple Blockchain implemented in Typescript which also contains a accompanying RESTful api which is used to serve the blockchain and the methods within. 

# Usage

This software requires an .env file at root to run successfully. This `env` file should contain the following environment variables:

```
PORT=YOUR_PORT
IP=YOUR_IP
CORS_ORIGIN=YOUR_CORS_ORIGIN
```

#### `PORT`

* The preferred port to expose your implementation on

#### `IP`

* The IP of current host of which the application is running on. 

#### `CORS_ORIGIN`

* The allowed origins of requests. In most instances, a mirror of IP.

<br>


## Start

```
git clone https://github.com/LGNorris/blockchain-network.git
cd blockchain-network
npm install
npm run build 
npm start
```

Docker instructions to be added soon.

#### `npm install`

* installs project dependencies (in package.json)

#### `npm run build`

* build and compiles TS to JS using TS config (in tsconfig.json)

#### `npm start`

* starts software

<br>
<br>


<!-- # Endpoints

## Public Endpoints

Open endpoints require no Authentication.

* [Status](login.md) : `GET /api/v2/user/status`

## Endpoints that require Authentication

Closed endpoints require a valid Token to be included in the header of the
request. A token should be passed from your SPA and its Auth0 implementation

### User endpoints

Each endpoint updates or displays information related to the user whose bearer token is provided with the request and whos user id is passed from the SPA to the url endpoint

* [Show basic user profile](Docs/get.md) : `GET /api/v2/user/basic`
* [Show full user profile with user metadata](Docs/get.md) : `GET /api/v2/user/full/{userId}`
* [Update user metadata](Docs/put.md) : `PUT /api/v2/update/{userId}`
* [Request password reset email](Docs/post.md) : `POST /api/v2/request-password-reset/{userId}`

<br>

### Notes

* For more information about the Auth0 API's used in this software visit https://auth0.com/docs/api/authentication or https://auth0.com/docs/api/management/v2 for more info -->