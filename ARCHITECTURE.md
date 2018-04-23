## Beekee architecture
Beekee is developed with [Meteor](http://www.meteor.com).

### Collections
* Authors : contains the list of all authors. An author is a user (student) without an account. Only teachers have an account (and can be "connected").
* Spaces : contains the list of all spaces.
* Categories : contains the list of all categories. Only teachers can edit categories.
* Codes : contains the list of all space codes. Used to check if a code is already assigned.
* Files : contains the reference (id) of all files uploaded.
* Posts : contains the list of all posts.
* Tags : contains the list of all tags.

### Templates
#### Layout
Global layout template used for all templates. Contains 4 yield regions filled by router: menu (slideout lateral menu), header, main, footer.

#### SpaceList
The HomePage of Beekee. Allows user to access a space with an access code. If user is connected, displays his space list. Also displays a list of visited spaces.

#### SpacePage
Displays space posts (PostItem template) and contains all the subscription/filtering logic.

#### Desktop Menu & Mobile Menu
Menus that display authors, categories and tags, and allow filtering posts. Desktop menu is included in main yield and is displayed only on desktops. Mobile menu is a slideout menu that is included in menu yield.

#### Admin
Restricted access. Displays all spaces and all users.

### Logic
#### Filtering and displaying posts logic
Posts subscription is updated reactively. By default, only the first 10 posts of the space are loaded [*temporarily disactivated*]. The server send a list of posts sorted by submission date (latest at the end). It send an interval of 10 posts by skipping all posts - 10. If user want to load 10 more posts, the skip value is reduced by 10, etc.  
Posts can be loaded reactively (in real time) if the option is enabled in settings. If not, the server publication is limited with the "limit" value (set by default to 10, and +10 if user load 10 more posts). When a post is sended by someone else, the counter "count-all-posts" (see publications) is updated and client is aware of this without to having to subscribe to all posts to count them (preserve brandwidth and load). If reactive "count-all-posts" is greater than "count-all-posts" set when the page is loaded, it displays an alert (you have X new messages) to the user.  
User can filter posts by author, category or tag. Each filtering involve a recalculation of skip and limit parameters. The count of posts is not done with "count-all-posts" but refers to the field nRefs of each filter.  

#### Uploading files
File upload is based on tomitrescak:meteor-uploads. uploadForm is the client-side, with autostart input. upload.js is server-side and use GraphicMagicks to resize and auto-orient images. The file ID is inserted in the Files collection when the upload and server-side resizing is finished.