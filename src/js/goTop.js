/**
 * 回到顶部模块
 * el为回到顶部的按钮{type == string}
 */

_require.define('top',function(){
	function top(el){
		$(el).click(function(){
			//chrome
			document.body.scrollTop = 0;
			//firefox
			document.documentElement.scrollTop = 0;
		});
	}
	return top;
});