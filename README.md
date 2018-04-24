
![Beekee logo](http://www.beekee.ch/images/beekee_logo_black.png)

Beekee is a simple open-source platform to support face-to-face collaboration.

With Beekee, you can:
* Make your learners active by allowing them to express themselves answering short questions, posting photos or sharing files;
* Make your learners interactive by allowing them to react to their peers contributions by commenting, modifying or building upon them;
* Distribute your course materials, documents or instructions to learners.

It has been also conceived to run on a Raspberry Pi that can be used in remote locations, we call this the **Beekee box**.<br>
The Beekee box doesn’t need an internet connection to operate. It generates its own WiFi network to which learners can connect to.

See more at [www.beekee.ch](http://www.beekee.ch)<br>

# Who we are
We are a team of makers and researchers with skills in pedagogy, educational technology, software development, UX, and 3D printing. Beekee is a project held by the TECFA unit from the University of Geneva.

# Make your own Beekee box

## Print your box
Got a 3D printer ? Print your own Beekee box for Raspberry Pi 3 B, we have put the model on Thingiverse (https://www.thingiverse.com/thing:2874892)!

## Beekee installation on a Raspberry Pi
Beekee was developed using the [Meteor framework](https://www.meteor.com). You will need to get a package of Beekee for your architecture or build one yourself. Since Meteor package have to run with specific versions of NodeJS and MongoDB, you will need to be careful to install the correct versions of NodeJS and MongoDB.

### Install Raspbian on a SD card (from macOS or Linux)
*Another Raspbian version could be installed, but Hotspot configuration may differ.*<br>
Download Jessie Lite at: http://downloads.raspberrypi.org/raspbian_lite/images/ <br>
Find SD card:<br>
```
diskutil list
```
Unmount SD card:<br>
```
diskutil unmountDisk /dev/diskX
```
Copy data (where X is your SD card):<br>
```
sudo dd bs=1m if=raspbian_image.img of=/dev/rdiskX conv=sync
```
Activate SSH:<br>
```
touch ssh (in the boot partition)
```

### Connect to the Raspberry
Connect your Raspberry to Internet and connect to it with SSH.<br>
**If you use a Raspberry Pi Zero W and wpa_supplicant.conf, it may cause problem during hotspot setup.**

Find the IP address and connect with SSH:<br>
```
ssh pi@ip_address
```
Extend the Filesystem with:<br>
```
sudo raspi-config
```
It is strongly recommended to change the user password:<br><br>
```
passwd
```

### Install NodeJS<br>
*You need to check the node version required by the Meteor project (meteor node --version) and get the right version for ARM (here: v0.10.40)*<br>
```
sudo apt-get update<br>
mkdir nodetemp<br>
cd nodetemp<br>
```
***
##### Raspberry Pi 3
```
wget https://s3-eu-west-1.amazonaws.com/conoroneill.net/wp-content/uploads/2015/07/node-v0.10.40-linux-arm-v7.tar.gz<br>
tar -zxvf node-v0.10.40-linux-arm-v7.tar.gz
```<br>
***
##### Raspberry Pi Zero W 
```
wget https://s3-eu-west-1.amazonaws.com/conoroneill.net/wp-content/uploads/2015/07/node-v0.10.40-linux-arm-v6.tar.gz<br>
tar -zxvf node-v0.10.40-linux-arm-v6.tar.gz
```
***
```
cd usr/local<br>
sudo cp -R * /usr/local
```

### Install ImageMagick<br>
```
sudo apt-get install -y imagemagick
```

### Install MongoDB<br>
```
sudo apt-get install -y mongodb-server
```

### Launch MongoDB as a service<br>
```
sudo service mongodb start
```
if errors:<br>
```
sudo rm /var/lib/mongodb/mongod.lock<br>
mongod --repair<br>
sudo service mongodb start
```<br>

### Build or get the right package
*If you want to build the package yourself, you will need to install Meteor first. Otherwise, get the package for your architecture in the "build" folder of this repository and skip this steps.*<br>

#### Install Meteor for ARM to build the package<br>
More info : [Meteor universal](https://github.com/4commerce-technologies-AG/meteor/)<br>
Install git<br>
```
sudo apt-get install -y git-core
``` 
Clone Meteor universal<br>
```
cd $HOME<br>
git clone https://github.com/4commerce-technologies-AG/meteor.git
```<br>
Switch to the 1.2.1 branch<br>
```
cd $HOME/meteor<br>
git checkout release-1.2.1-universal
```<br>
Check installed version (must be 1.2.1)<br>
```
$HOME/meteor/meteor --version
```<br>
Set an alias (edit .bashrc to make it permanent)<br>
```
alias meteor="$HOME/meteor/meteor"
```<br>

#### Build the package
This has to be done one the same architecture (on ARMv7 for ARMv7).<br>
Clone this repository and switch to the box's branch<br><br>
```
cd $HOME<br>
mkdir beekee-repo<br>
cd beekee-repo<br>
git clone https://github.com/smallhacks/beekee.git<br>
cd beekee/src<br>
```
Build the package<br><br><br>
```
meteor build ../../../beekee
``` 

### Start Node package at boot
Move the package on the Raspberry Pi, untar it and install npm dependencies<br>
```
cd $HOME<br>
cd beekee<br>
tar xzf **XXX**.tar<br>
cd bundle/programs/server<br>
npm install --production<br>
npm prune --production
```<br>
Install Forever
```
sudo -i npm install forever -g
```<br>
Edit /etc/rc.local and add before exit:
**rc.local must be executable**<br>
```
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000<br>
sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80 -j REDIRECT --to-port 3000<br>
export MONGO_URL='mongodb://localhost'<br>
export ROOT_URL='http://localhost'<br>
export PORT=3000<br>
export METEOR_SETTINGS='{"syncServerIP": "","adminPassword": "admin","public" : {"isBox": "true","prefix": "XX"}}'<br>
forever start /home/pi/beekee/bundle/main.js
``` 

### Configure the Hotspot<br>
Install hostapd and dnsmasq<br>
```
sudo apt-get -y install hostapd dnsmasq
```<br>
Replace dnsmasq configuration file /etc/dnsmasq.conf by:<br>
**Be sure not to include double spaces in config files**<br>

```
# Beekee hotspot configuration<br>
strict-order<br>
address=/box.beekee.ch/192.168.40.1<br>
no-hosts<br>
dhcp-range=192.168.40.3,192.168.40.50,255.255.255.0
```<br>
Create the hostapd configuration file /etc/hostapd/hostapd.conf and add:<br>
```
interface=wlan0<br>
driver=nl80211<br>
ssid=beekee<br>
hw_mode=g<br>
channel=11<br>
macaddr_acl=0<br>
auth_algs=1<br>
ignore_broadcast_ssid=0
```<br>
Edit the file /etc/default/hostapd and add:<br>
```
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```<br>
Edit the file /etc/network/interfaces and add:<br>
```
auto lo<br>
iface lo inet loopback<br>
iface eth0 inet dhcp<br>
auto wlan0<br>
allow-hotplug wlan0<br>
iface wlan0 inet static<br>
  ddress 192.168.40.1<br>
  netmask 255.255.255.0<br>
  network 192.168.40.0<br>
  broadcast 255.255.255.255<br>
  gateway 192.168.40.0
```<br>


Voilà!

### Notes
* You will need to configure a RTC to keep the date and the time up to date.
* You will need to secure your MongoDB database.
