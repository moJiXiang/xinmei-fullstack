(function() {
  $(function() {
    var apiBaseUri, domain, login;
    console.log('compline login.coffee success');
    apiBaseUri = '/v1/api';
    domain = 'http://117.121.25.124:3000';
    login = function() {
      var checked, email, pass;
      email = $('#inputEmail').val();
      pass = $('#inputPass').val();
      checked = $('input:checked').length;
      if (!email || !pass) {
        $('.email-error').text('邮箱或密码不能为空');
        return;
      }
      return $.ajax({
        method: 'post',
        url: apiBaseUri + "/authentication/login",
        data: {
          email: email,
          pass: pass
        },
        success: function(result) {
          console.log(result);
          if (checked > 0 && result.meta.code === 200) {
            $.cookie('xinmei-fullstack-email', result.data.email);
            $.cookie('xinmei-fullstack-name', result.data.name);
            return window.location.href = domain;
          } else {
            return $('.email-error').text(result.meta.message);
          }
        }
      });
    };
    $('#login-btn').on('click', login);
    return $(document).on('keypress', function(e) {
      var activeid, key;
      key = e.which;
      activeid = document.activeElement.id;
      if (key === 13 && activeid !== 'searchval') {
        return login();
      }
    });
  });

}).call(this);
