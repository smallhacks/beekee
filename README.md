
![Beekee logo](http://www.beekee.ch/images/beekee_logo_black.png)

Beekee is a simple open-source platform to support face-to-face collaboration.

With Beekee, you will:
* Make your learners active by allowing them to express themselves answering short questions, posting potos or sharing files;
* Make your learners interactive by allowing them to react to their peers contributions by commenting, modifying or biulding upon them;
* Distribute your course materials, documents or instructions to learners.

Beekee has been also conceived to run on a Raspberry Pi 3, we call this the Beekee box.

See more at [www.beekee.ch](http://www.beekee.ch)


## Installation on a Raspberry Pi 3 B
From Linux or macOS  

### Install Raspbian Jessie Lite on a SD card
Download it at: http://downloads.raspberrypi.org/raspbian_lite/images/  
Find sd card:  
```diskutil list```  
Unmount sd card:  
```diskutil unmountDisk /dev/diskX```  
Copy data:  
```dd bs=1m if=raspbian_image.img of=/dev/rdiskX conv=sync```  
Activate SSH:  
```sudo touch ssh (in the boot partition)```  

### Install MongoDB  
```sudo apt-get update```  
```sudo apt-get install mongodb-server```  

### Launch MongoDB as a service  
```sudo service mongodb start```  
if errors:  
```sudo rm /var/lib/mongodb/mongod.lock```  
```mongod --repair```  
```sudo service mongodb start```  

### Install nodeJS  
-> you have to check the node version needed by the Meteor project (meteor node --version) and get the right version for ARM (here v0.10.40)  
```mkdir nodetemp```  
```cd nodetemp```  
```wget https://s3-eu-west-1.amazonaws.com/conoroneill.net/wp-content/uploads/2015/07/node-v0.10.40-linux-arm-v7.tar.gz```  
```tar -zxvf node-v0.10.40-linux-arm-v7.tar.gz```  
```cd usr/local```  
```sudo cp -R * /usr/local```  

### Build Meteor package
-> this has to be done from the same architecture (on ARM for ARM)  
```meteor add ecmascript```  
```meteor build ../new_package```  
Move and untar the package on the Raspberry Pi  
```cd bundle/programs/server```  
```npm install --production```  
```npm prune --production```  

### Install ImageMagick  
```sudo apt-get install imagemagick```  

### Start node package  
```export MONGO_URL='mongodb://localhost'```  
```export ROOT_URL='http://localhost'```  
```export PORT=3000```  
```export METEOR_SETTINGS='{"syncServerIP": "","adminPassword": "admin","public" : {"isBox": "true","prefix": "XX"}}'```  
```node main.js```  