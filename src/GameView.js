/*
 * The title screen consists of a background image and a
 * start button. When this button is pressed, and event is
 * emitted to itself, which is listened for in the top-level
 * application. When that happens, the title screen is removed,
 * and the game screen shown.
 */
import animate;
import ui.View;
import ui.ImageView;
import ui.TextView;
import ui.widget.GridView;

/* The title screen is added to the scene graph when it becomes
 * a child of the main application. When this class is instantiated,
 * it adds the start button as a child.
 */
exports = Class(ui.ImageView, function (supr) {

	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			image: "resources/images/FillerGameView.png"
		});

		supr(this, 'init', [opts]);
		
		this._bubbleloaded = false;
		this._score = 0;

		this.build();
	};

	this.build = function() {
		/* Since the start button is a part the background image,
		 * we just need to create and position an overlay view that
		 * will register input events and act as button.
		 */
		var startbutton = new ui.View({
			superview: this,
			x: 16,
			y: 432,
			width: 32,
			height: 32
		});

		/* Listening for a touch or click event, and will dispatch a
		 * custom event to the title screen, which is listened for in
		 * the top-level application file.
		 */
		startbutton.on('InputSelect', bind(this, function () {
			this.emit('gameview:done');
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
		
		this.on('app:start', bind( this, function(){
			this._score = 0;
			this._scoreBoard.setText(this._score.toString());
			this.loadBubble();
		}));
		
		
		// This is the bubblecomb to hold the image views for the bubbles
		this._gridView = new GridView({
			superview: this,
			x: 32,
			y: 96,
			width: 256,
			height: 288,
			cols: 16,
			rows: 9,
			//Make hide cells out of the grid range...
			hideOutOfRange: true,
			//Make cells in the grid range visible...
			showInRange: true
		});
		
		
		// 2D array 9 by 8 of image views for the bubbles
		this._bubblearray = [];
		for( var vrow = 0; vrow < 9; vrow ++ ){
			this._bubblearray[vrow] = [];
			for( var vcol = 0; vcol < 8; vcol ++ ){
				if( vrow % 2 === 0 ){
					this._bubblearray[vrow][vcol] = new ui.ImageView({
						superview: this._gridView,
						colspan: 2,
						row: vrow,
						col: vcol * 2,
						height: 32,
						width: 32
					});
				}
				else{
					this._bubblearray[vrow][vcol] = new ui.ImageView({
						superview: this._gridView,
						colspan: 2,
						row: vrow,
						col: vcol * 2 + 1,
						height: 32,
						width: 32
					});
				}
			}
		}
		
		this._clown = new ui.ImageView({
			superview: this,
			x: 128,
			y: 416,
			height: 64,
			width: 64,
			image: 'resources/images/clownface.png'
		});
		
		this._hand = new ui.ImageView({
			superview: this,
			x: 208,
			y: 448,
			height: 32,
			width: 32
		});
		
		this._loadedBubble = new ui.ImageView({
			superview: this,
			x: 144,
			y: 416,
			height: 32,
			width: 32,
			image: 'resources/images/bubble.png'
		});
		
		this._animateBubble = animate(this._loadedBubble);
		
		for( var vrow = 0; vrow < 9; vrow++ ){
			for( var vcol = 0; vcol < 8-vrow%2; vcol++ ){
				this._bubblearray[vrow][vcol].on('InputSelect', bind( this, function(a, b){
					if( this._bubbleloaded === true )
					{
						this._bubbleloaded = false;
						this._animateBubble.clear();
						this._animateBubble.now({
							x: (a%2 === 0 ? 32+32*b : 48+32*b),
							y: (96+32*a)},
							1000,
							animate.easeOut)
						.then(bind(this, function(c,d){
							this._bubblearray[c][d].setImage(this._loadedBubble.getImage());
							this._score += 10;
							this._scoreBoard.setText(this._score.toString());
							},a,b))					
						.then({
							x: 144, y: 416, image: ''},0)
						.then(bind( this, function(){
							this.loadBubble();
						}));
	
					}
				},vrow,vcol));
			}
		}
		
	}; // end build()
	
	this.clearArray = function(){
		for( var vrow = 0; vrow < 9; vrow++ ){
			for( var vcol = 0; vcol < 8; vcol++ ){
				this._bubblearray[vrow][vcol].setImage('');
			}
		}
	};
	
	this.loadBubble = function(){
		// Pick a color.
		var pick = Math.random()*4 | 0;
		switch(pick){
			case 0:
				this._loadedBubble.setImage('resources/images/bubble.png');
				break;
			case 1:
				this._loadedBubble.setImage('resources/images/bluebubble.png');
				break;
			case 2:
				this._loadedBubble.setImage('resources/images/yellowbubble.png');
				break;
			case 3:
				this._loadedBubble.setImage('resources/images/greenbubble.png');
				break;
		}
		// Set image to color.
		// Set to bubbleloaded.
		this._bubbleloaded = true;
	};
	
	this.getScore = function(){
		return this._score;
	};

});
