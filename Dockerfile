FROM node:18-alpine AS base

FROM base AS developer
WORKDIR /app
RUN apk add shadow
CMD ["sh", "-c", \
     "groupmod -g $(stat -c '%u' /app) node; \
      usermod -u $(stat -c '%u' /app) -g $(stat -c '%u' /app) node; \
      su node -c 'yarn && yarn format && yarn build && yarn typeorm:run-migrations && yarn start:dev'"]

FROM base AS builder
WORKDIR /app
COPY package*.json yarn.lock tsconfig.build.json tsconfig.json /app/
COPY src /app/src
RUN yarn
RUN yarn install --production --frozen-lockfile --modules-folder /prod_modules
RUN yarn build

FROM base AS executor
USER node
WORKDIR /prod
COPY --chown=node:node --from=builder /prod_modules /prod/node_modules
COPY --chown=node:node --from=builder /app/dist /prod/dist
CMD [ "node", "dist/main.js" ]