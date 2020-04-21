FROM node:12.14.1

ENV PROJECT_DIR="/app"
WORKDIR $PROJECT_DIR

COPY package* ./

RUN npm install

CMD ["npm", "run", "watch"]
