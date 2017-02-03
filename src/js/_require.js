/*
 * 2016-10-18 16:00:50 fyc构建 
 * 
 * 2016-11-5 10:21:27 拆分提示,添加path必须为数组类型
 * 
 * 2016-11-16 09:45:01 修改提示错误问题
 * 
 * 2016-12-11 09:50:44 修复提示错
 * */
(function(global, factory) {
	global._require = factory(global);
})(typeof window !== 'undefined' ? window : this, function(global) {
		//模块列表
	var	modules = {
			//模块路径
			modulePaths: [],
			//模块id名
			moduleIdNames: [],
			//已经引入的模块
			isLoadmodulePaths: [],
			//是重复调用use
			isUse: false,
			//模块接口函数
			moduleFns: {}
		},
		//判断模块是否加载
		isLoadEnd = [],
		//获取对象
		_$;
	
	//共享变量
	Object.defineProperty(global,'G',{
		value:{},
		enumerable: true,
		configurable: false,
		writable:false
	});


	_$ = (function() {
		var getEls = (function() {
			return function(el) {
				return document.getElementsByTagName(el)
			};
		})();

		var getEl = (function() {
			return function(el) {
				return document.getElementById(el)
			};
		})();
		return {
			getEls: getEls,
			getEl: getEl
		}
	})(_$);

	/*引入模块文件*/
	function _require(id) {
		if(typeof id === 'string') {
			//从模块中获取对象
			var moduleIndex = modules.moduleIdNames.indexOf(id);
			if(moduleIndex === -1) {
				error(0, id);
			} else {
				//返回暴露的接口
				return new modules.moduleFns[id]();
			}
		} else {
			error(1);
		}
	}

	/*模块构建*/
	_require.define = function(id, fn) {
		//id不能为数字
		if(typeof id === 'string') {
			if(typeof fn === 'function') {
				//是否已存在同样id的模块名
				if(modules.moduleIdNames.indexOf(id) === -1) {
					//储存模块名
					modules.moduleIdNames.push(id);
					//模块函数推入到临时的数组内,在调用结束后执行
					modules.moduleFns[id] = fn;

					/*--------------------------错误警告--------------------------*/
				} else {
					error(2, id);
				}
			} else {
				error(3);
			}
		} else {
			error(4);
		}
	}

	/*开始模块构建初始化引入模块文件*/
	_require.use = function(callback) {
		if(_require.config instanceof Object) {
			var modulePaths = _require.config.path;
			if(modulePaths instanceof Array) {
				var len = modulePaths.length,
					i = 0;
				//把模块引入到文件中
				for(; i < len; i++) {
					//判定是否又重复引入的模块
					if(isLoadModules(modulePaths[i])) {
						var script = document.createElement('script');
						script.src = modulePaths[i];
						_$.getEls('head')[0].appendChild(script);
						//把模块文件索引推送到模块列表,方便获取
						modules.modulePaths.push(modulePaths[i]);
						//已加载的模块
						modules.isLoadmodulePaths.push(modulePaths[i]);
						//监听所有的script加载情况
						isLoadEnd.push(false);
						//加载模块成功
						script.onload = (function(i) {
							return function() {
								isLoadEnd[i] = true;
								//判断所有的模块加载是否完毕
								for(var j = 0, l = isLoadEnd.length; j < l; j++) {
									if(!isLoadEnd[j]) {
										return;
									}
								}
								//所有模块加载完毕后的回调函数
								callback();
							}
						})(i);
						//加载模块错误
						script.onerror = (function(i) {
							return function() {
								error(5,i);
							}
						})(i);
					}

				}
				if(modules.isUse) {
					callback();
				}
			} else {
				error(6);
			}
			/*--------------------------错误警告--------------------------*/
		} else {
			error(7);
		}
	}

	function error(errorStatus, id) {
		switch(errorStatus) {
			case 0:
				console.warn('找不到' + id + '模块!');
				break;
			case 1:
				console.warn('文件引用id必须为字符串!');
				break;
			case 2:
				throw('存在相同' + id + '的模块!');
				break;
			case 3:
				console.warn('传入的第二参数不是函数类型');
				break;
			case 4:
				console.warn('模块id必须为字符串!');
				break;
			case 5:
				throw(modules.modulePaths[id] + '模块加载有误!');
				break;
			case 6:
				console.warn('_require.config配置路径类型为数组!');
				break;
			case 7:
				console.warn('_require.config配置有误!');
				break;
			default:
				;
		}
	}

	//判定是否多次使用use，以及多次引入相同的模块
	function isLoadModules(path) {
		var i = 0,
			len = modules.isLoadmodulePaths.length;
		for(; i < len; i++) {
			if(modules.isLoadmodulePaths[i] === path) {
				modules.isUse = true;
				return false;
			}
		}
		return true;
	}
	
	_require.version = '1.0.5';
	
	return _require;
});