#!bin/bash
# @(#)Init WebIOPi

sudo systemctl webiopi stop
sudo systemctl webiopi start
sudo chown -R pi /usr/share/webiopi/htdocs
cp -r ./motor /usr/share/webiopi/htdocs
