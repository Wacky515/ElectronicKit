#!/bin/bash
# @(#) Auto start up WebIOPi

source ~/dotfiles/function/result_echo.sh

readonly PROCESS="set auto start up WebIOPi"

ym_echo ">> ${PROCESS^}"
# sudo service webiopi start
sudo systemctl daemon-reload && \
# ↓ "zsh" 環境下では
# perl: warning: Please check that your locale settings:
sudo systemctl enable webiopi.service && \
systemctl status webiopi.service && \
result_echo $? ${PROCESS}
