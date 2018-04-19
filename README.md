
![Beekee logo](http://www.beekee.ch/images/beekee_logo_black.png)

Beekee is a simple open-source platform to support face-to-face collaboration.

With Beekee, you can:
* Make your learners active by allowing them to express themselves answering short questions, posting potos or sharing files;
* Make your learners interactive by allowing them to react to their peers contributions by commenting, modifying or biulding upon them;
* Distribute your course materials, documents or instructions to learners.

It has been also conceived to run on a Raspberry Pi 3, we call this the Beekee box.

See more at [www.beekee.ch](http://www.beekee.ch)


## Installation on a Raspberry Pi 3
Beekee was developed using the [Meteor framework](https://www.meteor.com) and runs on nodeJS and MongoDB.

### Install Raspbian Jessie Lite on a SD card
Download Jessie at: http://downloads.raspberrypi.org/raspbian_lite/images/  
Find SD card:  
```diskutil list```  
Unmount SD card:  
```diskutil unmountDisk /dev/diskX```  
Copy data:  
```sudo dd bs=1m if=raspbian_image.img of=/dev/rdiskX conv=sync```  
Activate SSH:  
```touch ssh (in the boot partition)```  
Connect the Raspberry with Ethernet and start it  
Find his IP address and connect with SSH:    
```ssh pi@ip_address```  
Extend the Filesystem with:  
```sudo raspi-config``` 
It is strongly recommended to change the user password:    
```passwd```  

### Configure the Hotspot  
Instal hostapd and dnsmasq:
```sudo apt-get update```  
```sudo apt-get -y install hostapd dnsmasq```  
Replace dnsmasq configuration file /etc/dnsmasq.conf by:
```# Beekee hotspot configuration```  
```strict-order```  
```address=/box.beekee.ch/192.168.40.1```  
```no-hosts```  
```dhcp-range=192.168.40.3,192.168.40.50,255.255.255.0```  
Create the hostapd configuration file /etc/hostapd/hostapd.conf and add:  
```interface=wlan0```  
```driver=nl80211```  
```ssid=beekee```  
```hw_mode=g```  
```channel=11```  
```macaddr_acl=0```  
```auth_algs=1```  
```ignore_broadcast_ssid=0```  
Edit the file /etc/default/hostapd and add:  
```DAEMON_CONF="/etc/hostapd/hostapd.conf"```  
Edit the file /etc/network/interfaces and add:
```auto lo```  
```iface lo inet loopback```  
```iface eth0 inet dhcp```  
```auto wlan0```  
```allow-hotplug wlan0```  
```iface wlan0 inet static```  
```    address 192.168.40.1```  
```    netmask 255.255.255.0```  
```    network 192.168.40.0```  
```    broadcast 255.255.255.255```  
```    gateway 192.168.40.0```  

### Install MongoDB  
```sudo apt-get install mongodb-server```  

### Launch MongoDB as a service  
```sudo service mongodb start```  
if errors:  
```sudo rm /var/lib/mongodb/mongod.lock```  
```mongod --repair```  
```sudo service mongodb start```  

### Install nodeJS  
-> you have to check the node version required by the Meteor project (meteor node --version) and get the right version for ARM (here: v0.10.40)  
```mkdir nodetemp```  
```cd nodetemp```  
```wget https://s3-eu-west-1.amazonaws.com/conoroneill.net/wp-content/uploads/2015/07/node-v0.10.40-linux-arm-v7.tar.gz```  
```tar -zxvf node-v0.10.40-linux-arm-v7.tar.gz```  
```cd usr/local```  
```sudo cp -R * /usr/local```  

### Install ImageMagick  
```sudo apt-get install imagemagick``` 

### Build Meteor package
This has to be done from the same architecture (on ARM for ARM).  
Clone this repository and switch to the box's branch:  
```git clone https://github.com/smallhacks/beekee.git```  
```cd beekee```  
```git checkout box```  
Add ecmascript package:  
```meteor add ecmascript```  
```meteor build ../new_package```  
Move the package on the Raspberry Pi and then:  
```tar xzf beekee.tar```  
```cd bundle/programs/server```  
```npm install --production```  
```npm prune --production```  

### Start node package at boot
Install forever
```sudo -i npm install forever -g```  
Edit /etc/rc.local and add before exit:
```sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000```  
```sudo iptables -t nat -A PREROUTING -i wlan0 -p tcp --dport 80 -j REDIRECT --to-port 3000```  
```export MONGO_URL='mongodb://localhost'```  
```export ROOT_URL='http://localhost'```  
```export PORT=3000```  
```export METEOR_SETTINGS='{"syncServerIP": "","adminPassword": "admin","public" : {"isBox": "true","prefix": "XX"}}'```  
```forever start /home/pi/beekee/bundle/main.js``` 

### Notes
* You will need to configure a RTC to keep the date and the time up to date.
* You will need to secure your MongoDB database.