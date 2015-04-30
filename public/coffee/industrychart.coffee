Network = ()->
	# 全局变量
	container = null
	allData  = null
	width = 0
	height = 800
	biggerH = 800
	paddingTop = 20
	paddingLeft = 80
	paddinginner = 20
	# y轴坐标的倍数
	multiple = 1
	# 行业标题
	titles = []
	entindustryArr = []
	deepCompany = []
	# 层级
	deepNum = null
	# 列矩阵
	colrects = null
	rowrects =null
	# 所有的点
	nodes = null
	# 所有的线
	links = null
	# 所有的公司名字
	entnames = null
	# 每个公司绘制股东的点
	investmentnodes = null
	# 毎列圆的半径的值
	minValue = null
	maxValue = null
	# 每行矩形的高度
	minRectHeight = null
	maxRectHeight = null
	colrectsGroup = null
	rowrectsGroup = null
	nodesGroup = null
	linksGroup = null
	entNameGroup = null
	investmentGroup = null
	# 所有圆的半径的阈值
	widthRange = d3.scale.linear()
		.range([10, 40])
	# 毎列资金的阈值
	heightRange = d3.scale.linear()
	widthValues = d3.map()
	heightValues = d3.map()
	rectWidthValues = d3.map()
	# 存储点的位置
	nodePosition = d3.map()
	shiftValues = d3.map()
	shiftx = paddingLeft
	shifty = 0

	# 所有列的宽度
	colswidth = 0
	calculateHeight = 0
	color = d3.scale.category20()
	network = (selection, data) ->
		# 处理数据
		allData = data
		setupData(data)
		# 设置资金和圆半径的比例
		widthRange.domain([minValue, maxValue])
			.nice()
		# 计算宽度
		titles.forEach (t)->
			console.log widthRange(widthValues.get(t))
			width += widthRange(widthValues.get(t)) * 2 + paddinginner * 2
		width += paddingLeft

		heightRange.range([0, height / deepNum - (height / (deepNum * 5))])
		container = d3.select(selection).append("svg:svg")
			.attr("width", width+200)
			.attr("height", height+200)
		
		# 添加标题
		appendChartTitle()
		# 添加列矩阵
		appendColRects()
		# 添加行矩阵
		appendRowRects()
		# 添加行业轴
		appendXAxis()
		# 给每个行矩阵添加坐标轴
		appendYAxis()

		# 储存node的坐标信息
		place()
		appendLinks()
		appendNodes()
		appendEntname()
		# appendTitle()

	setupData = (data)->
		# 计算一些基本数据
		console.log '+++++++++++'
		console.log(data.nodes)
		data.nodes.forEach (n)->
			if titles.indexOf(n.entindustry)<0
				titles.push(n.entindustry)
			# if deeps.indexOf(n.deep)<0
			# 	deeps.push(n.deep)
			if not deepNum or n.deep > deepNum
				deepNum = Number(n.deep)

			if not minValue
				minValue = Number(n.regcap)
			else 
				if Number(n.regcap) < minValue
					minValue = Number(n.regcap)
			if not maxValue
				maxValue = Number(n.regcap)
			else 
				if Number(n.regcap) > maxValue
					maxValue = Number(n.regcap)
		# 计算列矩阵所需要的深度
		titles.forEach (title)->
			min = null
			max = null
			obj = {}
			obj.entindustry = title
			obj.children = []
			# titlewidth = title.length * 100
			# widthValues.set(title, titlewidth)

			data.nodes.forEach (n)->
				if n.entindustry is title
					obj.children.push(n)
					if not min
						min = Number(n.regcap)
					else 
						if Number(n.regcap) < min
							min = Number(n.regcap)
					if not max
						max = Number(n.regcap)
					else 
						if Number(n.regcap) > max
							max = Number(n.regcap)
					widthValues.set(title, max)
			obj.minregcap = min
			obj.maxregcap = max
			entindustryArr.push(obj)	

		# 计算行矩阵所需要的数据
		for num in [1..deepNum]
			min = null
			max = null
			obj = {}
			obj.deep = num
			obj.children = []
			data.nodes.forEach (n)->
				if Number(n.deep) is num
					obj.children.push(n)
					if not min
						min = Number(n.regcap)
					else 
						if Number(n.regcap) < min
							min = Number(n.regcap)
					if not max
						max = Number(n.regcap)
					else 
						if Number(n.regcap) > max
							max = Number(n.regcap)
					rowDomain = {}
					rowDomain.min = min
					rowDomain.max = max
					heightValues.set(n.deep, rowDomain)
			obj.minregcap = min
			obj.maxregcap = max
			deepCompany.push(obj)


	appendChartTitle = ()->
		container.append("svg:text")
			.attr("text-anchor", "middle")
			.attr("x", width / 2)
			.attr("y", paddingTop)
			.text("投资图")

	appendColRects = ()->

		colrectsGroup = container.append("svg:g")
			.attr("class", "colrects")

		colrects = colrectsGroup.selectAll("g")
			.data(entindustryArr)
			.enter()
			.append("svg:g")
			.attr("transform", (d, i)-> 
					title = if not i then titles[i] else titles[i - 1]
					r = widthRange(widthValues.get(title))
					w = (r + paddinginner)* 2
					shiftx += if not i then 0 else w
					shiftValues.set(d.entindustry, shiftx)

					# 存储每个点在当前矩阵的中心点
					sorttitle = titles[i]
					sortr = widthRange(widthValues.get(sorttitle))
					sfx = shiftx + sortr + paddinginner
					rectWidthValues.set(d.entindustry, sfx)
					# 根据行业对矩形进行平移
					"translate(#{shiftx}, #{paddingTop * 3})"
					)
			# .attr("fill", (d)-> color(d.entindustry))
			.attr("fill", "#fff")
		colrects.append("svg:text")
			.attr("y", -10)
			# .attr("x", (d, i) ->
			# 	title = titles[i]
			# 	# titlew = title.length * 12
			# 	w = widthValues.get(title)
			# 	# widthRange(w) / 2 + titlew / 2
			# 	widthRange(w) / 2
			# 	)
			.attr("fill", "#000")
			.text((d)-> d.entindustry)

		colrects.append("svg:rect")
			.attr("class", "colrect")
			.attr("width", (d)-> 

				# colswidth += widthRange(d.maxregcap) * 2 + paddinginner * 2
				# realW = widthRange(d.maxregcap) * 2 + paddinginner * 2
				# # rectWidthValues.set(d.entindustry, realW)
				# realW
				)
			.attr("height", height)

		colrects.append("svg:line")
			.attr("class", "colrectline")
			.attr("x1", (d)-> 
				(widthRange(widthValues.get(d.entindustry)) + paddinginner) * 2
				)
			.attr("y1", 0)
			.attr("x2", (d)-> (widthRange(widthValues.get(d.entindustry)) + paddinginner) * 2)
			.attr("y2", height - paddingTop * 3)

	# 添加行业轴
	appendXAxis = ()->
		container.append("svg:g")
			.attr("class", "x axis")
			.append("svg:line")
			.attr("x1", paddingLeft)
			.attr("y1", paddingTop * 3)
			.attr("x2", width)
			.attr("y2", paddingTop * 3)
	
	appendRowRects = ()->
		rowrectsGroup = container.append("svg:g")
			.attr("class", "rowrects")

		rowrects = rowrectsGroup.selectAll("g")
			.data(deepCompany)
			.enter()
			.append("svg:g")
			# .attr
			.attr("fill", "#fff")
			.attr("opacity", 0.5)
			.attr("transform", (d)->
				shifty += if d.deep is 1 then paddingTop * 3 else ((height - paddingTop * 3) / deepNum)
				"translate(#{paddingLeft}, #{shifty})"
				)

		rowrects.append("svg:rect")
			.attr("width", colswidth)
			.attr("height", ((height - paddingTop * 3) / deepNum))

		rowrects.append("svg:line")
			.attr("class", "rowrectline")
			.attr("x1", (d)-> 0)
			.attr("y1", (d)-> ((height - paddingTop * 3) / deepNum))
			.attr("x2", width - paddingLeft)
			.attr("y2", (d)-> ((height - paddingTop * 3)  / deepNum))

	appendYAxis = ()->

		rowrects.append("svg:g")
			.attr("class", (d)-> "yaxis yaxis" + d.deep)
		for num in [1..deepNum]
			hmin = heightValues.get(num).min / multiple
			hmax = heightValues.get(num).max / multiple
			heightRange.domain([0, hmax])

			yAxis = d3.svg.axis()
			    .scale(heightRange)
			    .orient("left")
			    .ticks(5)

			rowrectsGroup.select('.yaxis'+num)
				.call(yAxis)

	place = ()->
		allData.nodes.forEach (n)->
			key = n.lcid
			obj = {}
			x = rectWidthValues.get(n.entindustry)

			domainH = heightValues.get(n.deep)
			heightRange.domain([0, domainH.max / multiple])
			needH = ((height - paddingTop * 3) / deepNum) * (Number(n.deep) - 1) + heightRange(Number(n.regcap)/multiple)
			y = needH + paddingTop * 3

			r = widthRange(n.regcap)
			obj.x = x
			obj.y = y
			obj.r = r
			nodePosition.set(key, obj)

	appendNodes = ()->

		nodesGroup = container.append("svg:g")
			.attr("class", "nodes")

		nodes = nodesGroup.selectAll("circle.industrynode")
			.data(allData.nodes)

		nodes.enter().append("circle")
			.attr("class", "industrynode")
			.attr("r", (d)->
				r = widthRange(Number(d.regcap))
				r
				)
			.attr("cx", (d)-> 
				# rectWidthValues.get(d.entindustry)
				nodePosition.get(d.lcid).x
				)
			.attr("cy", (d)-> 
				# domainH = heightValues.get(d.deep)
				# console.log domainH
				# heightRange.domain([0, domainH.max / multiple])
				# needH = ((height - paddingTop * 3) / deepNum) * (Number(d.deep) - 1) + heightRange(Number(d.regcap)/multiple)
				# needH + paddingTop * 3
				nodePosition.get(d.lcid).y
				)
			# 点击绘制该点的投资公司或者股东
			.on('click', (d)->
				center = {}
				center.x = nodePosition.get(d.lcid).x
				center.y = nodePosition.get(d.lcid).y
				console.log center
				drawInvestment center, d.investment
				)
	appendEntname = ()->
		entNameGroup = container.append("svg:g")
			.attr("class", "entnames")

		entnames = entNameGroup.selectAll("text.entname")
			.data(allData.nodes)

		entnames.enter().append('text')
			.attr("class", 'entnametext')
			.attr('x', (d)->
				nodePosition.get(d.lcid).x
				)
			.attr('y', (d)->
				nodePosition.get(d.lcid).y
				)
			.attr('transform', (d)-> 
					entnamewidth = d.entname.length * 10
					"translate(#{-nodePosition.get(d.lcid).r - entnamewidth/2}, #{-nodePosition.get(d.lcid).r - 10})")
			.text((d)->
				d.entname
				)

	appendLinks = ()->
		linksGroup = container.append("svg:g")
			.attr("class", "links")

		links = linksGroup.selectAll('line.line')
			.data(allData.links)

		links.enter().append('line')
			.attr("class", "industrylink")
			.attr("stroke", "#ddd")
			.attr("x1", (d)->
				nodePosition.get(d.entsource).x
				)
			.attr("y1", (d)->
				nodePosition.get(d.entsource).y
				)
			.attr("x2", (d)->
				nodePosition.get(d.enttarget).x
				)
			.attr("y2", (d)->
				nodePosition.get(d.enttarget).y
				)
	drawInvestment = (center, investment)->
		if d3.select('.investments')
			d3.select('.investments').remove()
		# 第一个点的绘制角度
		startangle = 0
		# 两个圆之间的夹角
		angle = 360 / investment.length
		# 距离点击点的距离
		radius = 100

		radialLocation = (center, angle, radius) ->
		    x = (center.x + radius * Math.cos(angle * Math.PI / 180))
		    y = (center.y + radius * Math.sin(angle * Math.PI / 180))
		    {"x":x,"y":y}
		investment.forEach (obj)->
			coordinate = radialLocation center, startangle, radius
			obj.x = coordinate.x
			obj.y = coordinate.y
			startangle += angle
		investmentGroup = container.append("svg:g")
			.attr("class", "investments")

		investmentnodes = investmentGroup.selectAll("circle.investment")
			.data(investment)

		investmentnodes.enter().append("circle")
			.attr("class", "investmentnode")
			.attr('r', 10)
			.attr("cx", (d)-> d.x)
			.attr("cy", (d)-> d.y)

		# investmentnodes.exit().remove()


	return network

industryNetwork = Network()

lcid = $('#entname').data('lcid');
d3.json '/v1/api/analysis/'+lcid+'/industrychart', (json) ->
	console.log(json)

	data = json.data
	entname = null
	data.nodes.forEach (n)->
		if n.deep == 1
			entname = n.entname
	$('#entname>h3').html(entname)
	industryNetwork("#industrychart", data)