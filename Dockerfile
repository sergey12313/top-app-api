FROM node:current-alpine3.15
WORKDIR /opt/app
ADD package.json package.json
RUN npm install -g npm@latest 
RUN npm i  --legacy-peer-deps
ADD . .
RUN npm run build
RUN npm prune --production

