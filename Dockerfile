ARG ALPINE_VERSION=3.16
ARG NODE_VERSION=22
ARG KAPISIX_VERSION=1.0.0

LABEL org.opencontainers.image.source=https://github.com/ligreman/king-for-apisix
LABEL org.opencontainers.image.description="KApisix Docker image v${KAPISIX_VERSION}"
LABEL org.opencontainers.image.licenses="GPL-3.0"

FROM node:${NODE_VERSION}-alpine as builder
RUN apk update && apk add --no-cache dumb-init

WORKDIR /build/api
COPY api/package.json ./
COPY api/package-lock.json ./
RUN npm ci --only=production --ignore-scripts

WORKDIR /build/frontend
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN npm ci --only=production --ignore-scripts


#######################################################

FROM alpine:${ALPINE_VERSION}

ENV APP_HOME=/home/app/
ENV NODE_ENV=production

WORKDIR $APP_HOME

RUN addgroup -g 1000 node \
    && adduser -u 1000 -G node -s /bin/sh -D node \
    && chown node:node $APP_HOME

# Copy api and frontend node_modules, and api/www where the frontend build is exported
COPY --chown=node:node --from=builder /build $APP_HOME
# Copy the api files
COPY --chown=node:node api/routes api/app.js api/utils.js $APP_HOME/api/

# Copy /usr/bin/dumb-init, node and the entrypoint
COPY --chown=node:node --from=builder /usr/bin/dumb-init /usr/bin/dumb-init
COPY --from=builder /usr/local/bin/node /usr/local/bin/

USER node
EXPOSE 8080

ENTRYPOINT ["/usr/bin/dumb-init"]
CMD ["--", "node", "--use_strict", "src/server.js"]
