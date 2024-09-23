FROM nginx:1.27.0-alpine-perl
USER root

COPY nginx.conf /etc/nginx/nginx.conf
COPY . /usr/share/nginx/html

EXPOSE 80/tcp
CMD nginx -g 'daemon off;'