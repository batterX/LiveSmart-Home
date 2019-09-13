<?php

if(!isset($_GET['ssid']) || !isset($_GET['psk'])) return FALSE;

$ssid = $_GET['ssid']; $ssid = str_replace('"', '\\"', $ssid);
$psk  = $_GET['psk' ]; $psk  = str_replace('"', '\\"', $psk );

// 1) Remove All WiFi Networks
exec('sudo sed -i -e \'/network={/,$d\' /etc/wpa_supplicant/wpa_supplicant.conf');
// 2) Add New WiFi Network
exec("sudo sed -i -e \"\\\$anetwork={\\nssid=\\\"" . $ssid . "\\\"\\npsk=\\\"" . $psk . "\\\"\\n}\" /etc/wpa_supplicant/wpa_supplicant.conf");
// 3) Restart Services
exec('sudo systemctl daemon-reload; sudo systemctl restart dhcpcd');

return TRUE;