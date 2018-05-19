
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
*If you use a Raspberry Pi Zero W and wpa_supplicant.conf, it may cause problem during hotspot setup.*

Find the IP address and connect with SSH:<br>
```
ssh pi@ip_address
```
Extend the Filesystem with:<br>
```
sudo raspi-config
```
It is strongly recommended to change the user password:<br>

### Install NodeJS<br>
*You need to check the node version required by the Meteor project (meteor node --version) and get the right version for ARM (here: v0.10.40)*<br>
```
sudo apt-get update
mkdir nodetemp
cd nodetemp
```
***
##### Raspberry Pi 3
```
wget https://s3-eu-west-1.amazonaws.com/conoroneill.net/wp-content/uploads/2015/07/node-v0.10.40-linux-arm-v7.tar.gz
tar -zxvf node-v0.10.40-linux-arm-v7.tar.gz
```
***
##### Raspberry Pi Zero W 
```
wget https://s3-eu-west-1.amazonaws.com/conoroneill.net/wp-content/uploads/2015/07/node-v0.10.40-linux-arm-v6.tar.gz
tar -zxvf node-v0.10.40-linux-arm-v6.tar.gz
```
***
```
cd usr/local
sudo cp -R * /usr/local
cd $HOME
sudo rm -rf nodetemp
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
sudo rm /var/lib/mongodb/mongod.lock
mongod --repair
sudo service mongodb start
```

### Build or get the right package
*If you want to build the package yourself, you will need to install Meteor first. Otherwise, get the package for your architecture in the "build" folder of this repository and skip this steps.*<br>

#### Install Meteor for ARM to build the package
More info : [Meteor universal](https://github.com/4commerce-technologies-AG/meteor/)<br>
Install git<br>
```
sudo apt-get install -y git-core
``` 
Clone Meteor universal<br>
```
cd $HOME
git clone https://github.com/4commerce-technologies-AG/meteor.git
```
Switch to the 1.2.1 branch<br>
```
cd $HOME/meteor
git checkout release-1.2.1-universal
```
Check installed version (must be 1.2.1)<br>
```
$HOME/meteor/meteor --version
```
Set an alias (edit .bashrc to make it permanent)<br>
```
alias meteor="$HOME/meteor/meteor"
```

#### Build the package
This has to be done one the same architecture (on ARMv7 for ARMv7).<br>
Clone this repository and switch to the box's branch<br><br>
```
cd $HOME
mkdir beekee-repo
cd beekee-repo
git clone https://github.com/smallhacks/beekee.git
cd beekee/src
```
Build the package<br>
```
meteor build ../../../beekee
``` 

### Start Node package at boot
Move the package on the Raspberry Pi, untar it and install npm dependencies<br>
```
cd $HOME
cd beekee
tar xzf **XXX**.tar
cd bundle/programs/server
npm install --production
npm prune --production
```
Install Forever
```
sudo -i npm install forever -g
```
Edit /etc/rc.local and add before exit:<br>
*rc.local must be executable*<br>
```
export MONGO_URL='mongodb://localhost'
export ROOT_URL='http://localhost'
export PORT=80
export METEOR_SETTINGS='{"syncServerIP": "","adminPassword": "admin","public" : {"isBox": "true","prefix": "XX"}}'
forever start /home/pi/beekee/bundle/main.js
``` 
Allow Node to run on port 80 without sudo privileges
``` 
sudo apt-get install libcap2-bin
sudo setcap cap_net_bind_service=+ep /usr/local/bin/node
``` 

### Configure the Hotspot<br>
Install hostapd and dnsmasq<br>
```
sudo apt-get -y install hostapd dnsmasq
```
Replace /etc/dnsmasq.conf by:<br>
*Be sure not to include double spaces in config files.*<br>

```
# Beekee hotspot configuration
strict-order
address=/box.beekee.ch/192.168.40.1
no-hosts
dhcp-range=192.168.40.3,192.168.40.50,255.255.255.0
```
Create the hostapd configuration file /etc/hostapd/hostapd.conf and add:<br>
```
interface=wlan0
driver=nl80211
ssid=beekee
hw_mode=g
channel=11
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
```
Edit the file /etc/default/hostapd and add:<br>
```
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```
Replace the file /etc/network/interfaces by:<br>
```
auto lo
iface lo inet loopback
iface eth0 inet dhcp
auto wlan0
allow-hotplug wlan0
iface wlan0 inet static
  address 192.168.40.1
  netmask 255.255.255.0
  network 192.168.40.0
  broadcast 255.255.255.255
  gateway 192.168.40.0
```


Voilà!

### Notes
* You will need to configure a RTC to keep the date and the time up to date.
* You will need to secure your MongoDB database.