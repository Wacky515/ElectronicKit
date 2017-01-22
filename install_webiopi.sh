#!/bin/bash
# @(#) Install WebIOPi

source ~/dotfiles/function/result_echo.sh

readonly PROCESS="install WebIOPi"
readonly VER="0.7.1"

ym_echo ">> ${PROCESS^}"
# wget http://webiopi.googlecode.com/files/WebIOPi-0.6.0.tar.gz
wget http://sourceforge.net/projects/webiopi/files/ \
    WebIOPi-$VER.tar.gz/download
tar xvzf WebIOPi-$VER.tar.gz
cd WebIOPi-$VER
sudo ./setup.sh
result_echo $? ${PROCESS}
