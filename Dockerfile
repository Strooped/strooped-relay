FROM arm32v7/node:12.14.0-alpine as production

ENV PROJECT_DIR="/srv/app"
WORKDIR $PROJECT_DIR

COPY package* ./
COPY ./bin ./bin
COPY ./controller ./controller
COPY ./model ./model
COPY ./public ./public
COPY ./repository ./repository
COPY ./routes ./routes
COPY ./service ./service
COPY ./utils ./utils
COPY ./views ./views
COPY app.js .

RUN apk add --no-cache --virtual .gyp python make g++ \
    && npm install --production \
    && apk del .gyp

USER node
EXPOSE 3000

CMD ["node", "./bin/www"]

