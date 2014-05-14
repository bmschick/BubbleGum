/*
 * The title screen consists of a background image and a
 * start button. When this button is pressed, and event is
 * emitted to itself, which is listened for in the top-level
 * application. When that happens, the title screen is removed,
 * and the game screen shown.
 */

import ui.View;
import ui.TextView;
import ui.ImageView;

/* The title screen is added to the scene graph when it becomes
 * a child of the main application. When this class is instantiated,
 * it adds the start button as a child.
 */
exports = Class(ui.ImageView, function (supr) {

	var playerscore;

	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			image: "resources/images/FillerGameOverView.png"
		});

		supr(this, 'init', [opts]);
		
		this.playerscore = 0;
		
		this.build();
	};

	this.build = function() {
		/* Since the start button is a part the background image,
		 * we just need to create and position an overlay view that
		 * will register input events and act as button.
		 */
		var startbutton = new ui.View({
			superview: this,
			x: 58,
			y: 375,
			width: 200,
			height: 75
		});

		/* Listening for a touch or click event, and will dispatch a
		 * custom event to the title screen, which is listened for in
		 * the top-level application file.
		 */
		startbutton.on('InputSelect', bind(this, function () {
			this.emit('scoreview:done');
		}));
		
		this._scoreTitle = new ui.TextView({
			superview: this,
			x: 0,
			y: 32,
			width: 160,
			height: 32,
			autoSize: false,
			size: 24,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			wrap: false,
			color: '#D0A080',
			text: 'Score: '
		});
		
		this._scoreBoard = new ui.TextView({
			superview: this,
			x: 160,
			y: 32,
			width: 160,
			height: 32,
			autoSize: true,
			size: 24,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			wrap: false,
			color: '#D0A080',
			text: '000'
		});
				
	};
	
	this.setScore = function(s){
		this.playerscore = s;
		this._scoreBoard.setText(this.playerscore.toString());
	}
});
