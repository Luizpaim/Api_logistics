FROM node:14-alpine

ARG CACHEBUST=1

ARG INTERNAL_PACKAGES_GITLAB

RUN mkdir -p /home/node/b4-api/node_modules && mkdir -p /home/node/b4-api/dist && chown -R node:node /home/node/b4-api

WORKDIR /home/node/b4-api

COPY package.json yarn.* ./

USER node

RUN echo "//gitlab.com/api/v4/projects/27178462/packages/npm/:_authToken=${INTERNAL_PACKAGES_GITLAB}" >> ~/.npmrc

RUN echo "@b4-org:registry=https://gitlab.com/api/v4/projects/27178462/packages/npm/" >> ~/.npmrc

RUN yarn

RUN yarn autoclean --init

RUN yarn autoclean --force

COPY --chown=node:node . .

RUN yarn build

EXPOSE 3000

CMD ["yarn", "server"]
