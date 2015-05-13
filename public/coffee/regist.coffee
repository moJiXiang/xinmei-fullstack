$ ->
	console.log 'compile authentication coffee success'
	apiBaseUri = '/v1/api'
	domain = 'http://localhost:3000'

	regist = ()->
		name= $('#inputName').val()
		email= $('#inputEmail').val()
		pass= $('#inputPass').val()
		repass= $('#inputRePass').val()
		if not email
			$('.email-error').text('邮箱不能为空!')
			return

		if not name
			$('.name-error').text('姓名不能为空!')
			return

		if not pass or not repass
			$('.pass-error').text('密码不能为空!')
			return

		if pass isnt repass
			$('.pass-error').text('密码不一致!')
			return

		$.ajax({
			method: 'post',
			url: "#{apiBaseUri}/authentication/regist",
			data:
				name: name,
				email: email,
				pass: pass,
				repass: repass,
			,
			success: (result)->
				console.log result
				if result.meta.code is 200
					$.cookie('xinmei-fullstack-email', result.data.email, { expires: 7, path: '/' });
					# $.cookie('xinmei-fullstack', {name: result.data.name, pass: result.data.pass})
					window.location.href = domain
		})

	$('#regist-btn').on('click', regist)
	$(document).on('keypress', (e)->
		key = e.which
		activeid = document.activeElement.id
		if (key is 13 and activeid isnt 'searchval') then regist()
	)