$ ->
	console.log('compile searchwordsmanage coffee success!')
	apiBaseUri = '/v1/api'
	optionsdata = {}
	$.ajax({
		method: 'get',
		url: "#{apiBaseUri}/words",
		success: (results)->
			console.log(results)
			for result in results.data
				optionsdata[result.keyword] = result.words
				$('#keyword').append("<option value='#{result.keyword}'>#{result.keyword}</option>")
			for word in results.data[0].words
				$('#word').append("<option value='#{word}'>#{word}</option>")

	})
	getSeletSource  = (type)->
		$.ajax({
			method: 'get',
			url: "#{apiBaseUri}/enterprises",
			success: (results)->
				console.log(results)
				entarr = results.data.map((ent)->
					if type is 'entname'
						obj = {}
						obj.label = ent.entname
						obj._id = ent._id
						return obj
					else
						obj = {}
						obj.label = ent.corporation
						obj._id = ent._id
						return obj
				)
				console.log entarr
				$('#main').autocomplete({
					source: entarr
				})
		})
	getSeletSource('entname')

	$('#typechange').change(()->
		type = $(this).val()
		console.log type
		getSeletSource(type)
	)
	$('#keyword').change(()->
		console.log optionsdata
		thisselect = $(this).val()
		words = optionsdata[thisselect]
		$('#word').html('<option value="">空</option>')
		for word in words
			$('#word').append("<option>#{word}</option>")

	)
	$('#addsearchword-btn').click(()->
		main = $('#main').val()
		keyword = $('#keyword option:selected').val()
		word = $('#word option:selected').val()
		$.ajax({
			method: 'post',
			url: "#{apiBaseUri}/searchwords",
			data:
				main: main,
				keyword: keyword,
				word: word
			,
			success: (result)->
				searchwords = result.data
				$('#searchwords-list').append('<li class="list-group-item">"'+searchwords.main+' '+searchwords.keyword+' '+searchwords.word+'"</li>')
		})
	)
	