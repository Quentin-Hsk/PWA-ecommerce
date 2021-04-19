# IDK if we really need to make a Dockerfile to deploy on Heroku

FROM node:8.11.3-alpine

EXPOSE 3001

COPY ./package*.json ./
RUN yarn upgrade
RUN yarn install

COPY . .

CMD yarn start makedb && yarn start
