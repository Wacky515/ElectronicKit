#!/bin/bash
# @(#) Install WebIOPi

source ~/dotfiles/function/result_echo.sh

readonly PROCESS="install WebIOPi"

ym_echo ">> ${PROCESS^}"
# wget http://webiopi.googlecode.com/files/WebIOPi-0.6.0.tar.gz
wget http://sourceforge.net/projects/webiopi/files/ \
    WebIOPi-0.7.1.tar.gz/download
tar xvzf WebIOPi-0.6.0.tar.gz
cd WebIOPi-0.6.0
sudo ./setup.sh
result_echo $? ${PROCESS}
