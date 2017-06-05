FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html
ADD container_start.sh /start.sh
CMD /bin/bash /start.sh
