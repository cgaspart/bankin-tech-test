FROM debian:latest
RUN rm /etc/localtime
RUN ln -s /usr/share/zoneinfo/Europe/Paris /etc/localtime
RUN apt-get update
RUN apt-get install -y curl gnupg2 apt-transport-https

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
RUN npm install -g nodemon

RUN apt-get remove -y cmdtest
RUN apt-get update
RUN apt-get install -y yarn

RUN mkdir /app
COPY . /app
WORKDIR /app

CMD npm install && nodemon index.js