$ ->
	console.log 'compile navbar coffee success'
	apiBaseUri = '/v1/api'
	# 搜索框的ajax请求，包括进度条功能
	$('#search-btn').click(()->
		searchval = $('#searchval').val();
		time = null
		percent = 0
		$('.search-result').show()
		$('.search-progress>.progress-bar').attr('style', "width: 0%")

		$.ajax({
			method: 'get',
			url: "#{apiBaseUri}/search?enterprise=#{searchval}",
			beforeSend: ()->
				# 用来显示进度条的时间
				$('.search-progress').show()
				time = setInterval(()->
					$('.search-progress>.progress-bar').attr('style', "width: #{percent+=2}%")

				1000)
			,
			success: (result)->
				postTemplate = JST['public/templates/search-results.handlebars']
				html = postTemplate(result)
				$('#search-list').html(html)
				# 给动态的元素添加事件
				bindLoadQyFuc();
				bingLoadArticleFuc();
			,
			complete: ()->
				clearInterval(time)
				$('.search-progress>.progress-bar').attr('style', "width: 100%")
				setTimeout(()->
					$('.search-progress').hide()
				500)
		})	
	)
	# 搜索结果框的关闭功能
	$('#close-search-btn').click(()->
		$('.search-result').hide()
	)

	bindLoadQyFuc = ()->
		# 表格里面loaddata按钮功能
		$('.loaddata-btn').on('click', ()->
			# enterprise = $(this).data('enterprise')
			# status = $(this).data('status')
			lcid = $(this).data('lcid')
			# 开始请求接口抓取数据
			$('#beginload-btn').on("click", ()->
				time = null
				percent = 0
				$('.loaddata-result').show()
				$('.loaddata-progress>.progress-bar').attr('style', "width: 0%")
				console.log 'test'
				$.ajax({
					type: 'POST',
					url: "#{apiBaseUri}/loadqydata",
					data:
						lcid: lcid
					,
					beforeSend: ()->
						# 用来显示进度条的时间
						$('.loaddata-progress').show()
						time = setInterval(()->
							$('.loaddata-progress>.progress-bar').attr('style', "width: #{percent+=1}%")

						1000)
					,
					success: (result)->
						result.lcid = lcid;
						postTemplate = JST['public/templates/modal-result.handlebars']
						html = postTemplate(result)
						$('#modal-result').html(html)
					,
					complete: ()->
						clearInterval(time)
						$('.loaddata-progress>.progress-bar').attr('style', "width: 100%")
						setTimeout(()->
							$('.loaddata-progress').hide()
						500)

				})
			)
		)
	
	# 给每个下载文章信息按钮绑定事件
	bingLoadArticleFuc = ()->
		$('.loaddocs-btn').on('click', ()->
			enterprise = $(this).data('enterprise')
			lcid = $(this).data('lcid')
			wd = null
			$('#beginsearch-btn').on('click', ()->
				# 搜素关键词
				rule = $('input[name=optionsRadios]:checked', '#articledatamodal').val()
				keyword = $('input[name=optionsRadios]:checked', '#articledatamodal').parent().parent('div.radio').find('.searchval').val()
				switch rule
					when 'allmatch' then wd = '"' + "#{enterprise}" + '"'
					when 'exclude' 
						string = ''
						string = string + '-'+kw+' ' for kw in keyword.split(',') 
						wd = "#{enterprise} #{string}"
					when 'widematch' then wd = "#{keyword}"
					when 'intitle' then wd = "intitle:#{enterprise}"
					when 'allintitle'
						string = ''
						string = string + kw+' ' for kw in keyword.split(',') 
						wd = "allintitle:#{enterprise} #{string}"
					when 'keywords'
						string = ''
						string = string + kw+' ' for kw in keyword.split(',') 
						wd = "#{enterprise} #{string}"
				time = null
				percent = 0
				$('.loaddata-result').show()
				$('.loaddata-progress>.progress-bar').attr('style', "width: 0%")
				$.ajax({
					type: 'POST',
					url: "#{apiBaseUri}/spider",
					data:
						lcid: lcid,
						wd: wd
					,
					beforeSend: ()->
						# 用来显示进度条的时间
						$('.loaddata-progress').show()
						time = setInterval(()->
							$('.loaddata-progress>.progress-bar').attr('style', "width: #{percent+=1}%")

						1000)
					,
					success: (result)->
						postTemplate = JST['public/templates/search-doc.handlebars']
						html = postTemplate({lcid: lcid})
						$('#search-doc').html(html)
					,
					complete: ()->
						clearInterval(time)
						$('.loaddata-progress>.progress-bar').attr('style', "width: 100%")
						setTimeout(()->
							$('.loaddata-progress').hide()
						500)
				})
			)
		)













