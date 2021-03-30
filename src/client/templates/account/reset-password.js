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


Template.resetPassword.onRendered(function () {

    // Enable autofocus
    $('#password').focus();
});


Template.resetPassword.events({
    
    'submit form': function(e) {

        e.preventDefault();
        var password = e.target.password.value;
        console.log(Accounts._resetPasswordToken);

        Accounts.resetPassword(Accounts._resetPasswordToken, password,function(){
            alert(TAPi18n.__("register--password-changed-message"));
            Router.go('indexTeacher');
        });
    },
    'click .reset-password--button-submit': function(e) {
        e.preventDefault();
        $('#login--form').submit();
    }
});