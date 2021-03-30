// Copyright 2016-2020 UNIVERSITY OF GENEVA (GENEVA, SWITZERLAND)

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


Template.register.onRendered(function () {

    this.$('.register--input-username').focus();
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

    $(".register--form").validate({
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


Template.register.events({
    
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
            //if (password === passwordConfirm) {
                Accounts.createUser({email:email.toLowerCase().trim(),password:password,profile:{name:name}},function(err){
                    if(!err) {
                        Router.go('indexTeacher');
                        if (Meteor.settings.public.isBox === "false") {
                            Meteor.call('sendEmail', // Send an e-mail to user
                                Meteor.user().emails[0].address,
                                'vincent.widmer@beekee.ch',
                                TAPi18n.__("register--mail-subject"),
                                TAPi18n.__("register--mail-content")
                            );
                        }
                    }
                    else {
                        Session.set('errorMessage', err.reason);
                    }
                });
            // }
            // else {
            //     Session.set('errorMessage', TAPi18n.__('register--password-dont-match'));
            // }
        }
    },
    'click .register--button-submit': function(e) {
        e.preventDefault();
        $('#register--form').submit();
    }
});


Template.register.helpers({

    errorMessage: function() {
        return Session.get('errorMessage');
    }
});

