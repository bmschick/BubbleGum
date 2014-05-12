/*
 * The main application file, your game code begins here.
 */

//sdk imports
import device;
import ui.StackView as StackView;
//user imports
import src.MainMenu as MainMenu;
//import src.soundcontroller as soundcontroller;
import src.GameView as GameView;
import src.ScoreView as ScoreView;

/* Your application inherits from GC.Application, which is
 * exported and instantiated when the game is run.
 */
exports = Class(GC.Application, function () {

	/* Run after the engine is created and the scene graph is in
	 * place, but before the resources have been loaded.
	 */
	 
	 var rootView;
	 var score;
	 var mainmenu;
	 var gameview;
	 var scoreview;
	 
	this.initUI = function () {
		this.mainmenu = new MainMenu();//,
		this.gameview = new GameView();
		this.scoreview = new ScoreView();

		this.view.style.backgroundColor = '#60D060';
		this.score = 0;

		//Add a new StackView to the root of the scene graph
		this.rootView = new StackView({
			superview: this,
			x: device.width / 2 - 160,
			y: device.height / 2 - 240,
			width: 320,
			height: 480,
			clip: true,
			backgroundColor: '#374AB3'
		});

		this.rootView.push(this.mainmenu);

//		var sound = soundcontroller.getSound();

		/* Listen for an event dispatched by the title screen when
		 * the start button has been pressed. Hide the title screen,
		 * show the game screen, then dispatch a custom event to the
		 * game screen to start the game.
		 */
		this.mainmenu.on('titlescreen:start', bind(this,function () {
			this.rootView.style.backgroundColor = '#D06060';
//			sound.play('levelmusic');
			this.gameview.clearArray();
			this.rootView.push(this.gameview);
		}));

		this.mainmenu.on('titlescreen:quit', bind(this,function () {
			this.rootView.style.backgroundColor = '#60D060';
//			sound.play('levelmusic');
		}));

		this.mainmenu.on('titlescreen:score', bind(this,function () {
			this.rootView.style.backgroundColor = '#6060D0';
//			sound.play('levelmusic');
			this.rootView.push(this.scoreview);
		}));

		/* When the game screen has signalled that the game is over,
		 * show the title screen so that the user may play the game again.
		 */
		this.gameview.on('gameview:done',bind(this,function(){
			this.rootView.pop();  // TODO: transition here to avoid.
			this.rootView.push(this.scoreview);
		}));
			
		this.scoreview.on('scoreview:done',bind(this,function(){
			this.rootView.pop();
			this.score = 0;
		}));
	};

	/* Executed after the asset resources have been loaded.
	 * If there is a splash screen, it's removed.
	 */
	this.launchUI = function () {};
});
