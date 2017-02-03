/**
 * 侧边导航，根据滑动，侧边会存在对应选中
 * 
 */

_require.define('navChange', function() {
	/**
	 * sideEl 为侧边导航的对象expr {type = string}
	 * floor为楼层对象expr {type = string}
	 * 
	 */
	function navChange(sideEl,floor) {
		
		$(window).scroll(function() {
			isHide();
			nav();
		});

		$(window).resize(function() {
			isHide();
		});
		function nav() {
			//滑动的时候获取侧边的top值
			var top = $(document).scrollTop();
			//侧边导航element对象
			var menu = $(sideEl);
			//楼层
			var items = $(floor);
			//被选中的楼层id
			var currentId = "";
			//循环楼层
			items.each(function() {
				var _this = $(this);
				//获取当前楼层到顶部的top值，可以使用原生getBoundingClientRect来替换
				var itemTop = _this.offset().top;
				//判断当前侧边滑动值 > 对象的top值 - 200偏移量 ||对象top值 < -20
				if(top > itemTop - 200 || itemTop < -20) {
					currentId = "#" + _this.attr("id");	//储存被选中的id值
				} else {
					return false;
				}
			});
			
			//从侧边的导航对象中查找选中的el
			var currentLink = menu.find(".active");
			//查看当前的被选中的id，而且被选中的id不能等于当前被选中el的href
			if(currentId && currentLink.attr("href") != currentId) {
				//删除class
				currentLink.removeClass("active");
				//给选中id添加class
				menu.find("[href=" + currentId + "]").addClass("active");
			}
		}
		//初始化，是否存在知道你哥条件显示
		function isHide() {
			if($(document).scrollTop() > 500 && window.innerWidth > 1380) {
				$(".left-nav").show(0);
			} else {
				$(".left-nav").hide(0);
			}
		}
		//初始化
		isHide();
		nav();
	}
	return navChange;
});