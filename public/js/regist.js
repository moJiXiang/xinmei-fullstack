(function() {
  $(function() {
    var apiBaseUri, domain, regist;
    console.log('compile authentication coffee success');
    apiBaseUri = '/v1/api';
    domain = 'http://117.121.25.124:3000';
    regist = function() {
      var email, name, pass, repass;
      name = $('#inputName').val();
      email = $('#inputEmail').val();
      pass = $('#inputPass').val();
      repass = $('#inputRePass').val();
      if (!email) {
        $('.email-error').text('邮箱不能为空!');
        return;
      }
      if (!name) {
        $('.name-error').text('姓名不能为空!');
        return;
      }
      if (!pass || !repass) {
        $('.pass-error').text('密码不能为空!');
        return;
      }
      if (pass !== repass) {
        $('.pass-error').text('密码不一致!');
        return;
      }
      return $.ajax({
        method: 'post',
        url: apiBaseUri + "/authentication/regist",
        data: {
          name: name,
          email: email,
          pass: pass,
          repass: repass
        },
        success: function(result) {
          console.log(result);
          if (result.meta.code === 200) {
            $.cookie('xinmei-fullstack-email', result.data.email, {
              expires: 7,
              path: '/'
            });
            return window.location.href = domain;
          }
        }
      });
    };
    $('#regist-btn').on('click', regist);
    return $(document).on('keypress', function(e) {
      var activeid, key;
      key = e.which;
      activeid = document.activeElement.id;
      if (key === 13 && activeid !== 'searchval') {
        return regist();
      }
    });
  });

}).call(this);
