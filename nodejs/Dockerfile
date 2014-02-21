FROM ubuntu

RUN apt-get update
RUN apt-get install -y udev
RUN dpkg-divert --local --rename /usr/bin/ischroot && ln -sf /bin/true /usr/bin/ischroot
RUN apt-get upgrade -y

RUN apt-get install -y git-core curl build-essential openssl libssl-dev libfontconfig1-dev
RUN apt-get install -y python-software-properties python g++ make
RUN echo "deb http://us.archive.ubuntu.com/ubuntu/ precise universe" >> /etc/apt/sources.list
RUN echo "deb http://archive.ubuntu.com/ubuntu precise universe" >> /etc/apt/sources.list
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get install -y rlwrap nodejs
RUN node -v

RUN locale-gen en_US en_US.UTF-8

RUN npm config set registry http://registry.npmjs.org/
RUN npm -v

RUN curl https://phantomjs.googlecode.com/files/phantomjs-1.9.2-linux-x86_64.tar.bz2 -o phantomjs-1.9.2.tar.bz2
RUN tar -xjf phantomjs-1.9.2.tar.bz2
RUN ln -s /phantomjs-1.9.2-linux-x86_64/bin/phantomjs /usr/bin/phantomjs
RUN npm install -g phantom

RUN apt-get install -y rsyslog

ADD phantom_proxy.js /phantom_proxy.js
ADD phantom_proxy.json /phantom_proxy.json
ADD phantom_proxy.conf /etc/init/phantom_proxy.conf

ADD syslog_relay.conf /etc/rsyslog.conf
ADD rsyslog.init /etc/init/rsyslog.conf

ENV NODE_PATH /usr/lib/node_modules
ENV ORIGIN_HOST 10.19.0.1
ENV ORIGIN_PORT 49199
ENV PROXY_LISTEN_PORT 8181

CMD ["/sbin/init"]
