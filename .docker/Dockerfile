FROM node:alpine
RUN mkdir -p /usr/webapp
COPY package.json /usr/webapp/package.json
RUN cd /usr/webapp; npm install  --loglevel verbose
WORKDIR /usr/webapp
COPY . .
RUN npm run build 
EXPOSE 8080
CMD ["npm", "start"]
