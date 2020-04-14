# strooped-relay
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/455a41cf230948869e4bed43f6e54bce)](https://app.codacy.com/gh/Strooped/strooped-relay?utm_source=github.com&utm_medium=referral&utm_content=Strooped/strooped-relay&utm_campaign=Badge_Grade_Dashboard) [![Known Vulnerabilities](https://snyk.io/test/github/Strooped/strooped-relay/badge.svg)](https://snyk.io/test/github/Strooped/strooped-relay) [![Build Status](https://travis-ci.com/Strooped/strooped-relay.svg?branch=master)](https://travis-ci.com/Strooped/strooped-relay)

## Dataset colors

Colors are extracted from https://htmlcolorcodes.com/color-names/, using some custom JavaScript, and stores as json
in `public/colors.json`.

### Attributes

- **name** - Human readable name of the color
- **color** - Hex code for this color
- **family** - Which overall family this color belongs to (red, blue, etc.).
               Can be used to give more difficult tasks, by only using a single color family

```js
let colors = [];

// Finds each color row and maps it into a dictionary containg name, code and which colorFamily
// it belongs
for (let row of document.getElementsByClassName('color')) {
    let colorFamily = row.parentNode.parentNode.parentNode.id;
    let name = row.getElementsByClassName('color-name')[0].textContent.trim();

    let colorCode = row.getElementsByClassName('color-hex')[0].textContent.trim();

    colors.push({ name, color: colorCode, family: colorFamily })
}

// Dumped to the console
JSON.stringify(colors);
```

## Development setup
The development setup is based on [Docker](https://docs.docker.com/install/) and
[Docker Compose](https://docs.docker.com/compose/install/), see their respective installation guides.

### Running backend server
To setup the backend server, use `docker-compose up`, alternatively add `-d` if detached mode (running in the
background) is preferred. To see the logs while running in detached mode, run `docker-compose logs -f` (`-f` is follow
for the log, it will print any new log that arrives). An option is to run `docker-compose logs -f <name of service>`
which only show you the logs from the containers of the given service, ie. redis, db or app1-2. Shut down of the servers
is done using `docker-compose down`.

When programming it might be necessary to take down the containers and start from scratch. `docker-compose down &&
docker-compose up -d && docker-compose logs -f` is a way to take the containers down, restart them and attach to the logs.

## Development guide
There is a debug page at / where it is possible to send socket-messages with any event and any message.

### Events
There are defined some events, these are either to be sent from gamemaster or the player.

From gamemaster:
- game:start
- game:ending
- round:ending
- task:start
- task:ending

From the player:
- task:answer

In addition, there are the following automatic events:
- player:joined
- error
- connect_error
- connect
- disconnect

All events consist of two parts, the event name and the message that should be conveyed. The message
should be in JSON, but that is not validated in the backend.

There is no validation on the messages in the backend, except for the connections events, where
there is validation of the token to join the room.
