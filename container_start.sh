indexFile=/usr/share/nginx/html/index.html
if [ "$ENV" == "production" ]
then
  sed -i 's/https:\/\/suncity-backend.lemonwf.com/https:\/\/suncity-backend.ylemon.tech/g' $indexFile
fi

nginx -g "daemon off;"
