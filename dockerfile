FROM node:20

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run predev
RUN npm run prebuild
RUN npm run build
EXPOSE 8000
CMD npm start