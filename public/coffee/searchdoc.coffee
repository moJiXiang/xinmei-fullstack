$ ->
	console.log 'compile searchdoc coffee success'
	# 给添加的查看按钮动态增加事件
	$('.viewcontent').on('click', ()->
		content = $(this).data('content')
		console.log content
		$('#contentmodal').find('.modal-body').html(content)
		$('#contentmodal').modal()
	)