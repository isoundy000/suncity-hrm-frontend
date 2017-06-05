#! /bin/bash
imageName=index.alauda.cn/chareice/suncity-frontend
npm run build
docker build -t $imageName .
