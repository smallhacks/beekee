
![Beekee logo](http://www.beekee.ch/images/beekee_logo_black.png)

Beekee is a simple open-source platform to support face-to-face collaboration.

With Beekee, you can:
* Make your learners active by allowing them to express themselves answering short questions, posting photos or sharing files;
* Make your learners interactive by allowing them to react to their peers contributions by commenting, modifying or building upon them;
* Distribute your course materials, documents or instructions to learners.

It has been also conceived to run on a Raspberry Pi that can be used in remote locations, we call this the **Beekee box**.  
The Beekee box doesn’t need an internet connection to operate. It generates its own WiFi network to which learners can connect to.

See more at [www.beekee.ch](http://www.beekee.ch)  

# Who we are
We are a team of makers and researchers with skills in pedagogy, educational technology, software development, UX, and 3D printing. Beekee is a project held by the TECFA unit from the University of Geneva.

# Make your own Beekee box

## Print your box
Got a 3D printer ? Print your own Beekee box for Raspberry Pi 3 B, we have put the model on Thingiverse (https://www.thingiverse.com/thing:2874892)!

## Beekee installation on a Raspberry Pi
Beekee was developed using the [Meteor framework](https://www.meteor.com). You will need to get a package of Beekee for your architecture or build one yourself. Since Meteor package have to run with specific versions of NodeJS and MongoDB, you will need to be careful to install the correct versions of NodeJS and MongoDB.

### Install Raspbian on a SD card (from macOS or Linux)
*Another Raspbian version could be installed, but Hotspot configuration may differ.*  
Download Jessie Lite at: http://downloads.raspberrypi.org/raspbian_lite/images/  
Find SD card:  
```
diskutil list
```  
Unmount SD card:  
```
diskutil unmountDisk /dev/diskX
```  
Copy data (where X is your SD card):  
```
sudo dd bs=1m if=raspbian_image.img of=/dev/rdiskX conv=sync
```  
Activate SSH:  
```
touch ssh (in the boot partition)
```  

### Connect to the Raspberry
Connect your Raspberry to Internet and connect to it with SSH.  
**If you use a Raspberry Pi Zero W and wpa_supplicant.conf, it may cause problem during hotspot setup.**

Find the IP address and connect with SSH:    
```
ssh pi@ip_address
```  
Extend the Filesystem with:  
```
sudo raspi-config
```  
It is strongly recommended to change the user password:    
```
passwd
```  

### Install NodeJS  
*You need to check the node version required by the Meteor project (meteor node --version) and get the right version for ARM (here: v0.10.40)*  
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
```  

### Install ImageMagick  
```
sudo apt-get install -y imagemagick
```  

### Install MongoDB  
```
sudo apt-get install -y mongodb-server
```  

### Launch MongoDB as a service  
```
sudo service mongodb start
```  
if errors:  
```
sudo rm /var/lib/mongodb/mongod.lock  
mongod --repair  
sudo service mongodb start
```  

### Build or get the right package
*If you want to build the package yourself, you will need to install Meteor first. Otherwise, get the package for your architecture in the "build" folder of this repository and skip this steps.*  

#### Install Meteor for ARM to build the package  
More info : [Meteor universal](https://github.com/4commerce-technologies-AG/meteor/)  
Install git  
```
sudo apt-get install -y git-core
``` 
Clone Meteor universal  
```
cd $HOME  
git clone https://github.com/4commerce-technologies-AG/meteor.git
```  
Switch to the 1.2.1 branch  
```
cd $HOME/meteor  
git checkout release-1.2.1-universal
```  
Check installed version (must be 1.2.1)  
```
$HOME/meteor/meteor --version
```  
Set an alias (edit .bashrc to make it permanent)  
```
alias meteor="$HOME/meteor/meteor"
```  

#### Build the package
This has to be done one the same architecture (on ARMv7 for ARMv7).  
Clone this repository and switch to the box's branch    
```
cd $HOME  
mkdir beekee-repo  
cd beekee-repo  
git clone https://github.com/smallhacks/beekee.git  
cd beekee/src  
```
Build the package      
```
meteor build ../../../beekee
``` 

### Start Node package at boot
Move the package on the Raspberry Pi, untar it and install npm dependencies  
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
Edit /etc/rc.local and add before exit:
```
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000  
sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80 -j REDIRECT --to-port 3000  
export MONGO_URL='mongodb://localhost'  
export ROOT_URL='http://localhost'  
export PORT=3000  
export METEOR_SETTINGS='{"syncServerIP": "","adminPassword": "admin","public" : {"isBox": "true","prefix": "XX"}}'  
forever start /home/pi/beekee/bundle/main.js
``` 

### Configure the Hotspot  
Install hostapd and dnsmasq  
```
sudo apt-get -y install hostapd dnsmasq
```  
Replace dnsmasq configuration file /etc/dnsmasq.conf by:  
```
# Beekee hotspot configuration  
strict-order  
address=/box.beekee.ch/192.168.40.1  
no-hosts  
dhcp-range=192.168.40.3,192.168.40.50,255.255.255.0
```  
Create the hostapd configuration file /etc/hostapd/hostapd.conf and add:  
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
Edit the file /etc/default/hostapd and add:  
```
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```  
Edit the file /etc/network/interfaces and add:  
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
