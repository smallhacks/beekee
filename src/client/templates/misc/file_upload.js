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

    // if (progress.progress != 100) { // Hide buttons if progress is not 100%
    //   $(".post-submit--button-submit").hide();
    //   $(".post-edit--button-submit").hide();
    // }
 
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