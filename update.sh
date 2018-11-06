#!/bin/sh
# updater.sh

sudo cp /home/pi/livesmart-home/html /var/www -r
sudo chmod 777 /var/www -R

sudo rm /home/pi/BatterX
sudo cp /home/pi/livesmart-home/BatterX /home/pi
sudo chmod 777 /home/pi/BatterX

sudo rm /home/pi/CloudStream
sudo cp /home/pi/livesmart-home/CloudStream /home/pi
sudo chmod 777 /home/pi/CloudStream

sudo rm /home/pi/GetApikey
sudo cp /home/pi/livesmart-home/GetApikey /home/pi
sudo chmod 777 /home/pi/GetApikey

sudo cp /home/pi/livesmart-home/launcher.sh /home/pi
sudo chmod 777 /home/pi/launcher.sh

sudo cp /home/pi/livesmart-home/updater.sh /home/pi
sudo chmod 777 /home/pi/updater.sh

sudo rm /home/pi/livesmart-home -r

sudo rm /home/pi/update.sh

sudo sed -i 's/.*www-data .*/www-data ALL=(ALL:ALL) NOPASSWD:ALL/' /etc/sudoers

sudo reboot