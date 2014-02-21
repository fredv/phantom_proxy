FROM ubuntu

RUN echo "deb http://us.archive.ubuntu.com/ubuntu/ precise universe" >> /etc/apt/sources.list
RUN echo "deb http://archive.ubuntu.com/ubuntu precise universe" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get upgrade -y

RUN apt-get install -y git-core curl build-essential openssl libssl-dev libfontconfig1-dev
RUN apt-get install -y python-software-properties python g++ make
RUN locale-gen en_US en_US.UTF-8

RUN apt-get update
RUN add-apt-repository -y ppa:gnome3-team/gnome3
RUN apt-get update

RUN apt-get install -y libwebkitgtk-3.0-dev
RUN apt-get install -y mercurial
RUN hg clone -u 1.2 https://code.google.com/p/go
RUN cd go/src && bash all.bash
RUN ln -snf /go/bin/go /usr/bin/go
RUN ln -snf /go/bin/gofmt /usr/bin/gofmt
RUN go version

ENV GOPATH /
RUN go get github.com/sourcegraph/webloop

RUN apt-get install -y rsyslog

ENV ORIGIN_HOST 10.19.0.1
ENV ORIGIN_PORT 49211
ENV PROXY_LISTEN_PORT 80

ADD syslog_relay.conf /etc/rsyslog.conf
ADD rsyslog.init /etc/init/rsyslog.conf

#CMD ["/sbin/init"]
