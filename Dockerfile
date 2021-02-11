FROM node:8-alpine AS blockchain-node-builder

ARG PORT
ARG CORS_ORIGIN
ARG IP

ENV CORS_ORIGIN=${CORS_ORIGIN}
ENV PORT=${PORT}
ENV IP=${IP}

WORKDIR /app
COPY . .
RUN npm install
RUN npm run clean
RUN npm run build

# Our Second stage, that creates an image for production
FROM node:8-alpine AS blockchain-node-prod

ARG PORT
ARG CORS_ORIGIN
ARG IP

ENV CORS_ORIGIN=${CORS_ORIGIN}
ENV PORT=${PORT}
ENV IP=${IP}

WORKDIR /app
COPY --from=blockchain-node-builder ./app/dist ./dist
COPY --from=blockchain-node-builder ./app/config ./config

COPY package* ./
RUN npm install --production

EXPOSE 8080
CMD ["npm", "start"]