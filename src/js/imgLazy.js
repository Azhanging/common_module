_require.define('imgLazy', function() {
	function imgLazy() {
		var imgs = $('img[data-src]');
		function scrollHandler() {
			if(imgs.length > 0) {
				var scrollTop = window.scrollY;
				imgs.each(function(index, el) {
					var _this = $(el);
					if(el.getBoundingClientRect().top < window.innerHeight) {
						var src = _this.attr('data-src');
						_this.attr('src', src).removeAttr('data-src');
					}
				});
				//更新新的img列表
				imgs = $('img[data-src]');
			}
		}
		
		//初始化
		scrollHandler();
		//事件触发
		$(window).scroll(function() {
			scrollHandler();
		});
	}
	return imgLazy;
});