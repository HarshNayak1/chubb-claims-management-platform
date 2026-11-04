
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist/ /tmp/dist/

RUN INDEX_FILE=$(find /tmp/dist -name index.html -type f | head -n 1) \
    && test -n "$INDEX_FILE" \
    && cp -R "$(dirname "$INDEX_FILE")"/. /usr/share/nginx/html/ \
    && rm -rf /tmp/dist

EXPOSE 80
