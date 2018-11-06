#!/bin/sh
# updater.sh

cd /home/pi

git clone https://github.com/batterx/livesmart-home.git

sudo cp /home/pi/livesmart-home/update.sh /home/pi
sudo chmod 777 /home/pi/update.sh

sudo sh /home/pi/update.sh