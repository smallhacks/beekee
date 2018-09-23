Template.adminCreateAccount.onRendered(function () {

    this.$('.admin-create-account--input-username').focus();
    Session.set('errorMessage', ''); // Hide error messages

    if (Meteor.isClient) { // Localization mapping
        T9n.map(
            'fr', {
                'Email already exists.': TAPi18n.__('register--mail-exist')
            },
            'en', {
                'Email already exists.': TAPi18n.__('register--mail-exist')
            }       
        );
    }

    $.validator.messages.email = TAPi18n.__('register--mail-no-valid-message');

    $(".admin-create-account--form").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            name: {
                required: true,
                maxlength: 15
            },
            password: {
                required: true,
                minlength: 5
            },
            password_confirm: {
                required: true,
                minlength: 5,
                equalTo: "#password"
            }
        }
    }); 
});


Template.adminCreateAccount.events({
    
    'keypress input': function(event) {
        if (event.keyCode == 13) {
            $('#register--form').submit();
        }
    },
    'submit form': function (event) {
 
        event.preventDefault();
 
        var email = event.target.email.value; // E-mail is used as username
        var name = event.target.name.value;
        var password = event.target.password.value;
        var passwordConfirm = event.target.password_confirm.value;

        if (email && password) {
            Meteor.call('createAccount',email.toLowerCase().trim(),password,{name:name}, function(err){
                if(!err) {
                    $('#adminCreateAccount').modal('hide');
                    if (Meteor.settings.public.isBox === "false") {
                        Meteor.call('sendEmail', // Send an e-mail to user
                            Meteor.user().emails[0].address,
                            'vincent.widmer@beekee.ch',
                            TAPi18n.__("register--mail-subject"),
                            TAPi18n.__("register--mail-content")
                        );
                    }
                } else {
                    Session.set('errorMessage', err.reason);
                }

            })
        }
    },
    'click .admin-create-account--button-submit': function(e) {
        e.preventDefault();
        $('#admin-create-account--form').submit();
    }
});


Template.adminCreateAccount.helpers({

    errorMessage: function() {
        return Session.get('errorMessage');
    }
});

