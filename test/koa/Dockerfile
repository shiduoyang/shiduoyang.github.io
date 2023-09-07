FROM node:14

# 设置工作目录  
WORKDIR /usr/src/app

# 复制本地主机的下内容到镜像中的目标路径  
COPY package*.json /usr/src/app/

RUN  npm install

# 将当前目录下的所有文件添加到容器中
ADD  . /usr/src/app

# 定义容器启动时执行的命令
CMD [ "npm" ,"start" ]