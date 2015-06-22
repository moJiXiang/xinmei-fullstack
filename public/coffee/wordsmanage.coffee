$ ->
	console.log('compile wordsmanage coffee success!')
	apiBaseUri = '/v1/api'

	$('#addkeyword-btn').click(()->
		kw = $('#kw').val()
		$.ajax({
			method: 'POST',
			data:
				kw: kw
			,
			url: "#{apiBaseUri}/savekw",
			success: (data)->
				console.log data
				$('.list-group').append("<li class='list-group-item'>#{data.data.keyword}</li>")
		})
	)

	$('.addwords-btn').on("click",()->
		kw = $(this).data('kw')
		words = $(this).parent().parent().children('input.words').val()
		console.log kw, words
		$.ajax({
			method: 'POST',
			data:
				kw: kw,
				words: words
			,
			url: "#{apiBaseUri}/savewords",
			success: (data)->
				console.log data
		})
	)

	$('.del-keyword-btn').on('click', ()->
		id = $(this).data('id')
		self = $(this)
		$.ajax({
			method: 'GET',
			url: "#{apiBaseUri}/delkeyword/#{id}",
			success: (data) ->
				self.parent().remove()
		})
	)
	$('.delword-btn').on('click', ()->
		kw = $(this).parent().parent().parent().data('kw')
		word = $(this).data('word')
		console.log kw
		$.ajax({
			method: 'POST',
			data:
				kw: kw,
				word: word
			,
			url: "#{apiBaseUri}/delword",
			success: (data)->
				console.log data
		})
	)
