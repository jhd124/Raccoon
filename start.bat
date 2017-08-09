@echo ��С��ܷ�����
@echo Start raccoon server
@echo off
echo ------------------------------------------------------- >> log.txt
echo ����ʱ�䣺>>log.txt
date /t >>log.log
time /t >>log.log
start cmd /k "ipconfig&node router.js >> log.log"
start cmd /k "ipconfig&node manageServer.js >> Managerlog.log"
