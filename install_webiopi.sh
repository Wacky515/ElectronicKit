#!/bin/bash
# @(#) Install WebIOPi

source ~/dotfiles/function/result_echo.sh

# 実行したファイルのディレクトリに "cd"
cd $(dirname $0)

readonly PROCESS="install WebIOPi"
readonly VER="0.7.1"

ym_echo ">> ${PROCESS^}"

wget http://sourceforge.net/projects/webiopi/files/WebIOPi-${VER}.tar.gz
result_echo $? "download WebIOPi"

tar xvzf WebIOPi-${VER}.tar.gz
result_echo $? "unzip WebIOPi"

cd WebIOPi-${VER}
ym_echo $(pwd)

wget https://raw.githubusercontent.com/doublebind/raspi/master/webiopi-pi2bplus.patch
result_echo $? "download patch"
patch -p1 -i webiopi-pi2bplus.patch
result_echo $? "install patch"

sudo ./setup.sh
result_echo $? ${PROCESS}

# wget https://raw.githubusercontent.com/neuralassembly/raspi/master/webiopi.service
# result_echo $? "download systemd"
sudo cp -vb ./webiopi.service /etc/systemd/system/
result_echo $? "set auto start up"
