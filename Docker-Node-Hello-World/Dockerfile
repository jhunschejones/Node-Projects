FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependancies 
# A wildcard is used to insure both package.json AND package-lock.json are coppied
# where avaiable
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000
CMD ["npm", "start"]