# base image
FROM node:lts-alpine

WORKDIR /app

# copy for the sourse to the working directory
# first . is the source
# second . is working directory
COPY . .

RUN npm install --omit=dev

# security purpose
USER node

CMD [ "npm", "run", "start:prod"]

# public PORT
EXPOSE 8000