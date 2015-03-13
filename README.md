[![Circle CI](https://circleci.com/gh/christian-fei/webhook-publisher.svg?style=svg)](https://circleci.com/gh/christian-fei/webhook-publisher)

webhook-publisher
=================

A service to broadcast webhooks to connected clients.

---

The service will listen for webhooks on `/hook` (POST requests) and notify clients with the JSON information.

# Installation

- `npm install` the dependencies
- Run the service with `node index.js`

Optionally specify these environment variables:

- **WEBHOOK_PUBLISHER_HTTP_PORT** : port the service listens for webhooks
- **WEBHOOK_PUBLISHER_TCP_PORT** : port on which TCP clients can connect to


# Examples

- **arduino-ci-status**:  instruct an arduino to visualize the [state of the CI](https://github.com/christian-fei/arduino-ci-status) through red and green leds
- **web-ci-status**: broadcast build updates about the CI to connected [socket.io clients](https://github.com/christian-fei/web-ci-status)


### Example setup with CircleCI

Host the service on your own server.

Define in the `circle.yml` file of your project a *notify* clause for webhooks:

```
notify:
  webhooks:
    - url: http://YOUR_IP:3000/hook
```

where you would replace YOUR_IP with the actual url where the service is hosted.

Now everytime a build is finished, CircleCI will POST the summary of the build to the url specified above, and connected clients will be notified.
