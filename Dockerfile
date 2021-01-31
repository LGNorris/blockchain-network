# # FROM node:12-alpine

# # # build/compile your typescript outside the container first

# # ENV CORS_ORIGIN http://localhost:3001

# # # Create Directory for the Container
# # WORKDIR /usr/src/app
# # # Only copy the package.json file to work directory
# # COPY package.json .
# # # Install all Packages
# # RUN npm install
# # # Copy all other source code to work directory
# # ADD . /usr/src/app
# # # TypeScript
# # RUN npm run build

# # EXPOSE 3000
# # CMD [ "npm", "start" ]


# FROM node:8-alpine AS build
# WORKDIR /usr/src/app
# # Installing dependencies first can save time on rebuilds
# # We do need the full (dev) dependencies here
# COPY package.json yarn.lock ./
# RUN npm install
# # Then copy in the actual sources we need and build
# COPY tsconfig.json ./
# COPY config/ ./
# COPY src/ ./src/
# RUN npm run build

# FROM node:8-alpine AS depsc
# WORKDIR /usr/src/app
# # This _only_ builds a runtime node_modules tree.
# # We won't need the package.json to actually run the application.
# # If you needed developer-oriented tools to do this install they'd
# # be isolated to this stage.
# COPY package.json yarn.lock ./
# RUN npm install --only=prod

# FROM node:8-alpine
# WORKDIR /usr/src/app
# COPY --from=deps /usr/src/app/node_modules ./node_modules/
# COPY --from=build /usr/src/app ./dist/

# EXPOSE 3000
# CMD ["npm", "start"]

# Our first stage, that is the Builder

FROM node:8-alpine AS ts-sample-builder
ENV CORS_ORIGIN http://localhost:3001
ENV PORT 3001

WORKDIR /app
COPY . .
RUN npm install
RUN npm run clean
RUN npm run build

# Our Second stage, that creates an image for production
FROM node:8-alpine AS ts-sample-prod
ENV CORS_ORIGIN http://localhost:3001
ENV PORT 3001

WORKDIR /app
COPY --from=ts-sample-builder ./app/dist ./dist
COPY --from=ts-sample-builder ./app/config ./config

COPY package* ./
RUN npm install --production

EXPOSE 3000
CMD ["npm", "start"]