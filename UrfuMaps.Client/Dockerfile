FROM node:15.11.0-alpine3.13
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "./"]
# RUN npm install --only=prod --silent && mv node_modules ../
RUN npm install --only=prod
COPY . .
EXPOSE 3000
# RUN chown -R node /usr/src/app
# USER node
CMD ["npm", "start"]
