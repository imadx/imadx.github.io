var positionElements = (function(stage, w_width, w_height, i_width, i_height, c_width, c_height) {

	var pos_x_ratio = function(x) {return x/c_width;};
	var pos_y_ratio = function(y) {return y/c_height;}

	var window_x_ratio = w_width/ c_width;
	var window_y_ratio = w_height/ c_height;

	var clips = exportRoot;

	clips.sidepanel_left.set({x:pos(0, window_x_ratio)});
	clips.sidepanel_right.set({x:pos(800, window_x_ratio)});
	
	// clips.centerPanel_mc.set({y:pos(384, window_y_ratio)});
	// clips.footer_mc.set({y:pos(740, window_y_ratio)});

	// console.log(clips.top_menu)
	// if(w_width < 480){
	// 	var ratio = w_width/480;
	// 	clips.top_menu.set({scaleX:ratio, scaleY:ratio});
	// 	clips.center_content.set({scaleX:ratio, scaleY:ratio});

	// } else {
	// 	var ratio = 1;
	// 	clips.top_menu.set({scaleX:ratio, scaleY:ratio});
	// 	clips.center_content.set({scaleX:ratio, scaleY:ratio});
	// }


	function pos(pos, window){
		var ret = (pos*window);
		return ret;

	}

});	