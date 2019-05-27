FROM node:10.8.0-slim

# Define working directory.
WORKDIR /usr/app/

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install -g nodemon mocha


# Define default command.
CMD ["bash"]