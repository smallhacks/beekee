// Copyright 2016-2021 VINCENT WIDMER

// This file is part of Beekee Live.
    
// Beekee Live is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Beekee Live is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
//  along with Beekee Live.  If not, see <https://www.gnu.org/licenses/>.

//**************************************************************************


Template.fileUpload.onCreated(function () {

  Uploader.init(this);
  if (this.data)
    this.autoStart = this.data.autoStart;
});


Template.fileUpload.onRendered(function () {

  Uploader.render.call(this);
});


Template.fileUpload.helpers({

  'infoLabel': function() {
    var instance = Template.instance();

    var info = instance.info.get()
    if (!info) {
      return;
    }

    var progress = instance.globalInfo.get();

    if (progress.progress != 100) { // Hide buttons if progress is not 100%
        $('.live-feed-post-submit--button-submit').prop('disabled', true);
        $('.live-feed-post-edit--submit').prop('disabled', true);
        $('.resources-post-edit--submit').prop('disabled', true);
        $('.resources-post-submit--button-submit').prop('disabled', true);
    }
 
    return progress.running ?
      info.name + ' - ' + progress.progress + '% - [' + progress.bitrate + ']' :
      info.name + ' - ' + info.size + 'B';
  },
  'progress': function() {
    return Template.instance().globalInfo.get().progress + '%';
  },
  'submitData': function() {
        if (this.formData) {
            this.formData['contentType'] = this.contentType;
        } else {
            this.formData = {contentType: this.contentType};
        }
        return typeof this.formData == 'string' ? this.formData : JSON.stringify(this.formData);
    }
})