$ ->
	console.log 'compline login.coffee success'
	apiBaseUri = '/v1/api'
	domain = 'http://117.121.25.124/:3000'
	# send login post request
	login = ()->
		email = $('#inputEmail').val()
		pass = $('#inputPass').val()
		checked = $('input:checked').length
		if not email or not pass
			$('.email-error').text('邮箱或密码不能为空');
			return		

		$.ajax({
			method: 'post',
			url: "#{apiBaseUri}/authentication/login",
			data: 
				email: email,
				pass: pass
			,
			success: (result)->
				console.log result
				if checked > 0 and result.meta.code is 200
					$.cookie('xinmei-fullstack-email', result.data.email)
					$.cookie('xinmei-fullstack-name', result.data.name)
					window.location.href = domain
				else
					$('.email-error').text(result.meta.message);
		})

	$('#login-btn').on('click', login)
	$(document).on('keypress', (e)->
		key = e.which
		activeid = document.activeElement.id
		if (key is 13 and activeid isnt 'searchval') then login()
	)