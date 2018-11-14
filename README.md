# batterX Live&Smart Home (v18.12.1)

## Update Monitoring App

![](https://raw.githubusercontent.com/batterX/LiveSmart-Home/master/images/update-gif.gif)

Navigate to `http://YOUR_RASPI_IP_ADDRESS/service`

Click the `Update` icon (enter the correct password)

Click `OK` to confirm that the Live&Smart should be updated

After the update the Live&Smart will automatically reboot and apply the new version

### Manual Update:

If for some reason it is not possible to update the software using the Local Web App

Login to your Live&Smart using `Remote Desktop Connection`, `PuTTY` or directly using an HDMI display

Open Raspberry Pi's `File Manager` and navigate to `/home/pi`

Double-click on `updater.sh` and click `Execute in Terminal`

After the update the Live&Smart will automatically reboot and apply the new version.

### If the 'One-Click' and 'Manual' Update don't work:

Login to your Raspberry Pi using `Remote Desktop Connection` or directly using an HDMI display

Open the Linux `Terminal` and execute the following commands:
```
$ cd /home/pi
$ git clone https://github.com/batterx/livesmart-home.git
$ sudo cp /home/pi/livesmart-home/update.sh /home/pi
$ sudo chmod 777 /home/pi/update.sh
$ sudo sh /home/pi/update.sh
```
