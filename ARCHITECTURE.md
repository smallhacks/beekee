# Beekee architecture
Beekee is developed with [Meteor](http://www.meteor.com) and Bootstrap 4.
The template engine used is Blaze.


## Directory structure

- client : loaded on client side
  - global helpers : helpers that can be accessed anywhere
  - stylesheets
  - templates : HTML + JavaScript logic
    - account : login, logout, register, etc.
    - headers
    - index : student and teacher homepages
    - misc : 404, admin, access denied, etc.
    - space : space layout, modules (home, live_feed, etc.), settings, etc.
- lib : loaded on client and/or server side
  - collections : MongoDB "tables"
    - authors.js : contains the list of all authors. An author is a user (student) without an account. Only teachers have an account (and can be "connected").
    - categories.js : contains the list of all categories
    - codes.js : contains the list of all space codes. Used to check if a code is already assigned.
    - files.js : contains the reference (id) of all files uploaded
    - posts.js : contains the list of all posts. Every items (home item, live feed post, resource item, lesson item, etc.) are posts.
    - spaces.js : contains the list of all spaces (id, code, permissions, etc.)
  - controllers : controllers related to a route
  - i18n : localization files
  - permissions.js : check if users are allowed to do an action
  - router.js : contains all routes
- private : static server assets
  - appLoader.html : loaded before app is ready ("splashscreen") (needs appLoader.js)
  - serial.json : store the Serial number of the Beekee box
  - version.json : store the Beekee software version
- public : static client assets (img, fonts, etc.)
- server : loaded on server side
  - fixtures.js : database preparation
  - methods.js : server side methods
  - publications.js : server side publications
  - uploads.js : file upload methods
- appLoader.js : load HTML code before app is ready
- main.html : HTML head and meta
- settings.json : app config file (not used in production)

## Logic

### Meteor publications % subscriptions system
Meteor is built from the ground up on the Distributed Data Protocol (DDP) to allow data transfer in both directions. In Meteor a publication is a named API on the server that constructs a set of data to send to a client. A client initiates a subscription which connects to a publication, and receives that data. That data consists of a first batch sent when the subscription is initialized and then incremental updates as the published data changes. So a subscription can be thought of as a set of data that changes over time. Typically, the result of this is that a subscription “bridges” a server-side MongoDB collection, and the client side Minimongo cache of that collection. You can think of a subscription as a pipe that connects a subset of the “real” collection with the client’s version, and constantly keeps it up to date with the latest information on the server. [Meteor Guide](https://guide.meteor.com/data-loading.html)

### File uploads
File upload is supported by [tomi:meteor-uploads package](https://github.com/tomitrescak/meteor-uploads). Files are uploaded in .uploads directory. Each space has is own directory and each upload is stored in is own directory and by type (home, liveFeed, etc.). Pictures are resized with GraphicMagicks and auto-oriented. The file ID is inserted in the Files collection when the upload and server-side resizing is finished. Storyline archives are automatically uncompressed.

### Filtering and displaying liveFeed posts 
Posts subscription is updated reactively. By default, only the first 10 posts of the space are loaded. The server send a list of posts sorted by submission date (latest at the end). It send an interval of 10 posts by skipping all posts - 10. If user want to load 10 more posts, the skip value is reduced by 10, etc.  
The server publication is limited with the "limit" value (set by default to 10, and +10 if user load 10 more posts). When a post is sended by someone else, the counter "count-all-posts" (see publications.js) is updated and client is aware of this without to having to subscribe to all posts to count them (preserve brandwidth and load). If reactive "count-all-posts" is greater than "count-all-posts" set when the page is loaded, it displays an alert (you have X new messages) to the user.  
User can filter posts by author and category. Each filtering involve a recalculation of skip and limit parameters. The count of posts is not done with "count-all-posts" but refers to the field nRefs of each filter.