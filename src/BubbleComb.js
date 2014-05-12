/* BubbleComb
 * a child of the 
 * gameview
 */
 
 import animate;
 import ui.View
 import ui.ImageView;
 import ui.resource.Image as Image;
 import src.soundcontroller as soundcontroller;
 
 exports = Class(ui.View, function(supr){
 
	this.init = function (opts) {
	
	// is a gridview 
		opts = merge( opts, {
			width: 256,
			height: 288
		});
	
		supr(this, 'init', [opts]);
		
		this.build();
	};
	
	this.build = function() {
		
		this._gridView = new GridView({
			superview: this,
			x: 32,
			y: 96,
			width: 256,
			height: 288,
			cols: 5,
			rows: 4,
			//Make hide cells out of the grid range...
			hideOutOfRange: true,
			//Make cells in the grid range visible...
			showInRange: true
		});
	};
	
 });