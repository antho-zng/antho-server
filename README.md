# antho-server

A quick demo project for Anthony Zhang's Recurse Center application. A basic server that receives `set` and `get` requests: sets the given `value` to the given `key` when receiving a `set` request, returns the `value` associated with a `key` when receiving a `get` request.

## Features

- [DONE] runs a server that's accessible on `http://localhost:4000/`
- [DONE] server stores a passed key and value in memory when it receives a request on `http://localhost:4000/set?{somekey}={somevalue}`
- [DONE] server returns the value stored at `somekey` when it receives a request on `http://localhost:4000/get?key=somekey`
- [DONE] client display some kind of log returning success messages if a `set` request was successful, the requested `value` for a given key, or an error message if a request was not successful.

## Getting started

- Clone this repository.
- Run `node server.js`.
- Navigate to `http://localhost:4000/` on your browser.