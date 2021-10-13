FROM node:15.1.0-alpine3.12 as build

# Create app directory
RUN mkdir /app
COPY ./src/app/package.json /app/
COPY ./src/app/yarn.lock /app/

# Install dependency
WORKDIR /app
RUN yarn install --production && yarn cache clean

# build arguments
ARG environment=production
ARG service_name=template-nuxt-express
ARG use_only=stage

ENV HOST 0.0.0.0
ENV PORT 80
ENV NODE_ENV=production

# CodeBase
COPY ./src/app /app/

# build
RUN yarn build --production 

# nuxt start
CMD ["yarn", "start"]