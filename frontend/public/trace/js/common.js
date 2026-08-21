function stopBubble(e){
	//一般用在鼠标或键盘事件上
	if(e && e.stopPropagation){
	//W3C取消冒泡事件
	e.stopPropagation();
	}else{
	//IE取消冒泡事件
	window.event.cancelBubble = true;
	}
};