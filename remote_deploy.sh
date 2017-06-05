host="root@47.90.21.180"
imageName=hub.c.163.com/chareice/suncity-hrm-frontend
if [ $# -gt 0 ]; then
  imageName=$imageName:$1
fi
ssh $host << EOF
  docker pull $imageName
  docker rm -f suncity-frontend
  docker run --name suncity-frontend -p 8080:80 -d $imageName
EOF
