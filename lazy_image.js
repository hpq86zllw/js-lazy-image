/**
 * @name Lazy Image
 * @author Camel
 */
(function($){
	
	var LazyImageBuilder = (function(){
		
		// 懒加载图片容器
		var storage = new Array();
		
		return {
			build : function(image, config){
				var lazyImage = new LazyImage(image, config);
				// 若图片需要显示，则不放入容器
				if(!lazyImage.checkIfNeedToShow()){
					storage.push(lazyImage);
				}
			},
			// 检查所有图片是否需要显示
			checkAllIfNeedToShow : function(){
				for(var i = 0;i < storage.length;i++){
					// 若图片需要显示，则从容器中删除
					if(storage[i].checkIfNeedToShow()){
						storage.splice(i, 1);
						i--;
					}
				}
			}
		};
		
	})();
	
	function LazyImage(image, config){
				
		// 原图片url地址属性名称
		var originalUrlAttributeName = "data";
		// 距离可视区域距离多少时开始加载图片
		var threshold = 50;
		
		var $image = $(image);
		var imageToLoad = new Image();
		// 监听图片onload事件，若图片加载完成则替换$image的src属性为原图片url地址，此时使用的是浏览器缓存中的图片
		imageToLoad.onload = function(){
			$image.attr("src", $image.attr(originalUrlAttributeName));
		};
		var $window = $(window);
		
		var init = function(config){
			
			// 如果传入了配置参数，则使用
			if(config){
				
				if(config.originalUrlAttributeName){
					originalUrlAttributeName = config.originalUrlAttributeName;
				}
				if(config.threshold){
					threshold = config.threshold;
				}
				
			}
			
		};
		
		// 检查图片是否需要显示
		this.checkIfNeedToShow = function(){
			
			var imageTop = $image.offset().top;
			var windowScrollTop = $window.scrollTop();
			
			// 检查可视区域上方图片与可视区域的距离		
			var bottomDistance = windowScrollTop - (imageTop + $image.height());
			if(bottomDistance > threshold){
				return false;
			}
			
			// 检查可视区域下方图片与可视区域的距离			
			var topDistance = imageTop - (windowScrollTop + $window.height());
			if(topDistance > threshold){
				return false;
			}
			
			imageToLoad.src = $image.attr(originalUrlAttributeName);
			return true;
			
		};
		
		// 初始化加载
		init(config);
		
	}
	
	// 创建懒加载图片
	$.newLazyImage = function(image, config){
		for(var i = 0;i < image.length;i++){
			LazyImageBuilder.build(image[i], config);
		}
	};
	
	// 监听scroll事件，检查所有图片是否需要显示
	$(document).scroll(function(){
		LazyImageBuilder.checkAllIfNeedToShow();
	});
		
})(jQuery);
