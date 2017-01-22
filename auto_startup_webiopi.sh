#!/bin/bash
# @(#) Auto start up WebIOPi

source ~/dotfiles/function/result_echo.sh

readonly PROCESS="set auto start up WebIOPi"

ym_echo ">> ${PROCESS^}"
sudo service webiopi start
sudo systemctl enable webiopi
result_echo $? ${PROCESS}
