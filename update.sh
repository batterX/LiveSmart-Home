#!/bin/sh
# update.sh

sudo cp /home/pi/livesmart-home/html /var/www -r
sudo chmod 777 /var/www -R

sudo rm /home/pi/BatterX
sudo cp /home/pi/livesmart-home/BatterX /home/pi
sudo chmod 777 /home/pi/BatterX

sudo rm /home/pi/MqttStream
sudo cp /home/pi/livesmart-home/MqttStream /home/pi
sudo chmod 777 /home/pi/MqttStream

sudo cp /home/pi/livesmart-home/launcher.sh /home/pi
sudo chmod 777 /home/pi/launcher.sh

sudo cp /home/pi/livesmart-home/updater.sh /home/pi
sudo chmod 777 /home/pi/updater.sh



sudo sed -i 's/.*www-data .*/www-data ALL=(ALL:ALL) NOPASSWD:ALL/' /etc/sudoers

sudo apt-get install rng-tools -y



sudo kill $(pgrep "BatterX")
sudo kill $(pgrep "MqttStream")



sudo rm /home/pi/livesmart-home -r

sudo rm /home/pi/update.sh
