@echo 启动小浣熊服务器
@echo Start raccoon server
@echo off
echo ------------------------------------------------------- >> log.txt
echo 开机时间：>>log.txt
date /t >>log.txt
time /t >>log.txt
node router.js >> log.txt
