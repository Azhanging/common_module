(function($) {

	//检测是够是手机
	var isPhone = /iPhone|Android|Windows Phone|KFAPWI|MeeGo/.test(navigator.userAgent);

	//配置信息
	var config = {
		valiform: '.valiform', //验证表单
		valiformConfig: {
			tiptype: isPhone ? false : 3, //验证提示类型，
			datatype: {
				gphone: /^\d{9,14}$/, //国际号码
				telphone: /^\d{3,4}-\d{7,8}$/ //固定电话
			}
		},

		titleName: 'data-title', //配置title的属性
		contentName: 'data-content', //配置content的属性
		layerWidth: 'data-width', //弹窗的配置信息
		layerHeight: 'data-height', //弹窗的配置信息
		urlName: 'data-url', //url的属性
		dataName: 'ajax-data', //ajax-data的属性
		redirectUrlName: 'data-redirect-url', //重定向的属性
		parentRedirectName: 'data-parent-redirect',

		async: true, //异步ajax
		get: '.ask-get', //get绑定的事件
		post: '.ask-post', //post绑定的事件
		ajaxForm: '.ask-form', //直接ajax表单提交
		openLayer: '.ask-open-layer', //打开窗口
		redirectTime: 1000, //重新想url的时间
		btn: ['确认', '取消'], //confirm的两个按钮
		btnHandler: [function() { //confirm处理
			confirmYes.call(this);
		}, function() {
			layer.closeAll();
		}],
		success: function(data, target) { //默认的success提示
			var config = this.config;
			layer.msg(data.info, {
				icon: data.status == 0 ? 2 : 1
			});
			var url = data.url || target && data.status != 0 && target.attr(config.redirectUrlName) || false;
			redirect.apply(this, [url, target.attr(config.parentRedirectName) || false]);
		},
		error: function(data) { //错误的提示
			layer.msg(data.info, {
				icon: 2
			});
			redirect.call(this, data.url);
		}
	};

	//只允许实例化一次
	var configed = false;

	var ctx = {};

	//原型
	function Ask(opts) {

		if(configed) return ctx;

		if(this.constructor !== Ask) {
			return new Ask(opts);
		}

		configed = true;

		this.config = $.extend(true, config, opts);

		this.constructor.$ask = this;

		ctx = this

		init.call(this);
	}

	//初始化get和post
	function init() {
		setValiFrom.call(this);
		setGet.call(this);
		setPost.call(this);
		setForm.call(this);
		setOpenLayer.call(this);
	}

	//设置get请求
	function setGet() {
		setAjax.call(this, 'get');
	}

	//设置post请求
	function setPost() {
		setAjax.call(this, 'post');
	}

	//设置表单提交
	function setForm() {

		var config = this.config,
			_this = this;

		$(config.ajaxForm).each(function(index, el) {

			var $this = $(el);
			//没要验证才直接走这个，如果有验证直接走验证后的提交

			if(!$this.hasClass(config.valiform.replace(/^\./g, ''))) {

				$this.on('submit', function() {

					_this.ajaxformHandler.apply(_this, [{
						form: $this
					}]);

					return false;
				});
			}
		});
	}

	//提交表单的处理
	Ask.prototype.ajaxformHandler = function(opts) {

		var form = opts.form,
			type = form.attr('method') || 'get',
			action = form.attr('action') || '',
			ajaxData = form.serialize(),
			layIndex = layLoad();

		ajax.call(this, {
			type: type,
			action: action,
			form: form,
			btn: form,
			ajaxData: ajaxData,
			loadIndex: layIndex
		});
	}

	//弹窗
	function setOpenLayer() {
		var config = this.config;
		$(config.openLayer).on('click', function() {
			var $this = $(this),
				width = $this.attr(config.layerWidth),
				height = $this.attr(config.layerHeight),
				url = $this.attr(config.urlName),
				title = $this.attr(config.titleName) || '信息';

			layer.open({
				title: title,
				type: 2,
				area: [width || '700px', height || '450px'],
				fixed: false, //不固定
				maxmin: true,
				shadeClose: true,
				content: url || ''
			});
		});
	}

	//设置表单验证
	function setValiFrom() {
		this.valiform = $(this.config.valiform).Validform(this.config.valiformConfig);
	}

	/*开始请求*/
	function setAjax(type) {

		var _this = this,
			config = this.config;

		$(config[type]).on('click', function(event) {

			layClose();

			var $this = $(event.target),
				form = $this.closest('form'),
				action = '',
				ajaxData = {},
				layIndex,
				hasUrlAttr = hasUrlName.call(_this,$this); //检测是表单的提交还是直接的请求

			/*
			 * 是否为弹窗提示
			 * */
			if(isConfirm.call(this)) {
				confirm.call(this, {
					ctx: _this,
					method: type
				});
				return;
			}

			//默认打开load提示
			layIndex = layLoad();

			/*	
			 * 	如果是请求表单，则添加上表单的数据
			 * 	如果是直接请求数据，则需要添加上ajax的请求方法
			 * */
			if(hasUrlAttr) {
				action = $this.attr(config.urlName);
				ajaxData = new Function('return ' + $this.attr(config.dataName))();
			} else {
				action = form.attr('action');
				ajaxData = form.serialize();
			}

			ajax.call(_this, {
				type: type,
				action: action,
				form: form,
				btn: $this,
				ajaxData: ajaxData,
				loadIndex: layIndex
			});

			//阻止默认提交
			return false;
		});
	}

	/*
	 * ajax的请求
	 * */
	function ajax(opts) {
		var _this = this,
			index = opts.loadIndex;
		$.ajax({
			async: _this.config.async,
			type: opts.type,
			url: opts.action,
			data: opts.ajaxData,
			success: function(data) {
				layClose(index);
				config.success.apply(_this, [data, opts.btn]);
			},
			error: function(data) {
				layClose(index);
				config.error.apply(_this, [data]);
			}
		});
	}

	/*查看是是否存在url的属性*/
	function hasUrlName(target) {
		return target.attr(this.config.urlName) || false;
	}

	/*是否是弹窗提示的类型*/
	function isConfirm() {
		var confirm = $(this).attr('confirm');
		if(confirm && confirm.trim() == 'true') return true;
		return false;
	}

	/*弹窗选择*/
	function confirm(opts) {

		var $this = $(this),
			config = opts.ctx.config,
			content = $this.attr(config.contentName) || '',
			title = $this.attr(config.titleName) || '';

		layer.confirm.apply(null, [content, {
			title: title || false,
			btn: config.btn,
			closeBtn: new Function('return ' + $this.attr('close'))() ? 1 : false,
			target: $this,
			ctx: opts.ctx,
			method: opts.method
		}].concat(config.btnHandler));

	}

	/*弹窗选择yes按钮*/
	function confirmYes() {
		var target = $(this.target[0]),
			ctx = this.ctx,
			ajaxData = new Function('return ' + target.attr(config.dataName))(),
			method = this.method,
			url = target.attr(ctx.config.urlName);

		var layIndex = layLoad();

		ajax.call(ctx, {
			type: method,
			action: url,
			btn: target,
			ajaxData: ajaxData,
			loadIndex: layIndex
		});
	}

	/*重定向url*/
	function redirect(url, isParent) {
		var time = this.config.redirectTime;
		if(url) {
			setTimeout(function() {
				if(isParent) parent.location.href = url;
				else location.href = url;
			}, time);
		}
	}

	/*显示加载*/
	function layLoad() {
		return layer.load(1);
	}

	/*关闭全部弹窗*/
	function layClose(index) {
		if(index) layer.close(index);
		else layer.closeAll();
	}

	$.ajaxAsk = Ask;

})($ || jQuery);