FROM smebberson/alpine-nginx

MAINTAINER Hitesh Joshi <me@hiteshjoshi.com>

ADD ./public /usr/html/

ADD nginx.conf /etc/nginx/conf.d/default.conf