# syntax=docker/dockerfile:1

FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY build ./build
COPY src ./src

ARG SITE_URL=
ARG GA_MEASUREMENT_ID=
ARG BASE_PATH=
ARG SIGN_URL=
ARG SIGN_PROVIDER=
ARG SOURCE_CODE_URL=
ARG SOURCE_CODE_PLATFORM=
ENV SITE_URL=${SITE_URL} \
    GA_MEASUREMENT_ID=${GA_MEASUREMENT_ID} \
    BASE_PATH=${BASE_PATH} \
    SIGN_URL=${SIGN_URL} \
    SIGN_PROVIDER=${SIGN_PROVIDER} \
    SOURCE_CODE_URL=${SOURCE_CODE_URL} \
    SOURCE_CODE_PLATFORM=${SOURCE_CODE_PLATFORM}

RUN npm run build

FROM alpine:3.20 AS dist-export
COPY --from=build /app/dist /app/dist
CMD ["sh", "-lc", "mkdir -p /output && find /output -mindepth 1 -maxdepth 1 -exec rm -rf {} + && cp -R /app/dist/. /output/"]

FROM nginx:1.27-alpine AS preview
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
