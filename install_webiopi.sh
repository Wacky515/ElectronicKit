#!/bin/bash
# @(#) Install WebIOPi

source ~/dotfiles/function/result_echo.sh

# 実行したファイルのディレクトリに "cd"
cd $(dirname $0)

readonly PROCESS="install WebIOPi"
readonly VER="0.7.1"

ym_echo ">> ${PROCESS^}"
wget http://sourceforge.net/projects/webiopi/files/ \
    WebIOPi-$VER.tar.gz/download
result_echo $? "download WebIOPi"
tar xvzf WebIOPi-$VER.tar.gz
result_echo $? "unzip WebIOPi"
cd WebIOPi-$VER
sudo ./setup.sh
result_echo $? ${PROCESS}
