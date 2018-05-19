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