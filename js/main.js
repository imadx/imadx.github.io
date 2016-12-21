
var DEBUG = false;
var canvas, stage, exportRoot;
var score = 0;


var sidepanel_left;
var sidepanel_right;

function showOff(){

	canvas.style.transform = "translateX(0%)";
	sidepanel_left.gotoAndPlay(1);
	setTimeout(function(){
		sidepanel_right.gotoAndPlay(1);
	}, 1000)
	
}
function hideShowOff(){

	canvas.style.transform = "translateX(100%)";
	setTimeout(function(){
		sidepanel_left.gotoAndStop(0);
		sidepanel_right.gotoAndStop(0);
	}, 600);
}
function init() {
	// --- write your JS code here ---
	
	canvas = document.getElementById("canvas");
	exportRoot = new lib.game();

	stage = new createjs.Stage(canvas);
	stage.addChild(exportRoot);
	stage.update();
	createjs.Touch.enable(stage);

	createjs.Ticker.setFPS(lib.properties.fps);
	// createjs.Ticker.addEventListener("tick", stage);
	createjs.Ticker.addEventListener("tick", stage);
	createjs.Ticker.addEventListener("tick", gameLoop);

	sidepanel_left = stage.children[0].sidepanel_left;
	sidepanel_right = stage.children[0].sidepanel_right;

	var player = stage.children[0].player_mc;
	var to_mouseX = 0;
	var to_mouseY = 0;
	var mouse_ratio;
	var player_oldX, player_oldY;
	var speed = 20; 	// max 100
	var rotation_speed = 5; 	// max 100
	var enemy_speed = 3; 	// max 100

	var stage_width = lib.properties.width;
	var stage_height = lib.properties.height;

	var player_radius = 22;
	var enemy_radius = 13;
	var perks_radius = 13;
	var bullet_radius = 10;

	var player_enemy_min_dist = player_radius + enemy_radius;
	var player_perk_min_dist = player_radius + perks_radius;
	var bullet_enemy_min_dist = bullet_radius + enemy_radius;

	var enemy_total = 10;
	var perks_total = 30;

	var enemies_container = new createjs.Container();
	enemies_container.regX = stage_width/2;
	enemies_container.x = stage_width/2;
	enemies_container.regY = stage_height/2;
	enemies_container.y = stage_height/2;

	var perks_container = new createjs.Container();
	perks_container.regX = stage_width/2;
	perks_container.x = stage_width/2;
	perks_container.regY = stage_height/2;
	perks_container.y = stage_height/2;

	var bullets_container = new createjs.Container();
	bullets_container.regX = stage_width/2;
	bullets_container.x = stage_width/2;
	bullets_container.regY = stage_height/2;
	bullets_container.y = stage_height/2;

	var shockwave_container = new createjs.Container();
	shockwave_container.regX = stage_width/2;
	shockwave_container.x = stage_width/2;
	shockwave_container.regY = stage_height/2;
	shockwave_container.y = stage_height/2;

	var left, right, up, down;

	exportRoot.addChild(enemies_container);
	exportRoot.addChild(perks_container);
	exportRoot.addChild(bullets_container);
	exportRoot.addChild(shockwave_container);


	enemies_container.set({alpha: 0.6});
	perks_container.set({alpha: 0.6});
	bullets_container.set({alpha: 1});
	shockwave_container.set({alpha: 0.3});
	player.set({alpha: 0.3});

	exportRoot.setChildIndex( sidepanel_left, exportRoot.getNumChildren()-1);
	exportRoot.setChildIndex( sidepanel_right, exportRoot.getNumChildren()-1);

	(function(){

		stage.addEventListener('stagemousemove', updateMousePosition);
		stage.addEventListener('stagemousedown', handleClicks);
		document.getElementById("content").addEventListener('mousedown', handleClicks);
		document.addEventListener('mousemove', updateMousePosition_right_sider);
		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('keyup', handleKeyUp);
		randomizeEnemies_kill();
		randomizeEnemies_create();
		randomizePerks_create();

	})();

	(function(isResp, respDim, isScale, scaleType) {		
		var lastW, lastH, lastS=1;		
		window.addEventListener('resize', resizeCanvas);		
		resizeCanvas();		
		function resizeCanvas() {			
			var w = lib.properties.width, h = lib.properties.height;			
			var iw = window.innerWidth, ih=window.innerHeight;			
			var pRatio = window.devicePixelRatio, xRatio=iw/w, yRatio=ih/h, sRatio=1;			
			if(isResp) {                
				if((respDim=='width'&&lastW==iw) || (respDim=='height'&&lastH==ih)) {                    
					sRatio = lastS;                
				}				
				else if(!isScale) {					
					if(iw<w || ih<h)						
						sRatio = Math.min(xRatio, yRatio);				
				}				
				else if(scaleType==1) {					
					sRatio = Math.min(xRatio, yRatio);				
				}				
				else if(scaleType==2) {					
					sRatio = Math.max(xRatio, yRatio);				
				}			
			}			
			canvas.width = iw;
			canvas.height = ih;
			canvas.style.width = iw+'px';			
			canvas.style.height = ih+'px';
			stage.scaleX = pRatio*sRatio;			
			stage.scaleY = pRatio*sRatio;			
			lastW = iw; lastH = ih; lastS = sRatio;		
			mouse_ratio = 1/(pRatio*sRatio);
			stage_width = stage_height/ih*iw;
			positionElements(stage, iw, ih, w, h, w*sRatio, h*sRatio)
		}
	})(true,'both',true,1);


	function updateMousePosition(evt){
		to_mouseX = evt.stageX * mouse_ratio;
		to_mouseY = evt.stageY * mouse_ratio;


		

	}

	function updateMousePosition_right_sider(evt){
		sidepanel_right.set({rotation: 4 * evt.clientY/window.innerHeight - 2});

	}


	function randomizeEnemies_kill(){

		var killIndex = Math.floor(Math.random() * enemy_total);

		if(enemies_container.length == 0){
			return;
		}
		killEnemy(enemies_container.getChildAt(killIndex));

		x = Math.floor(Math.random() * stage_width);
		y = Math.floor(Math.random() * stage_height);

		setTimeout(function(){
			randomizeEnemies_kill();
		}, Math.floor(Math.random() * 5 + 5) * 1000);
	}

	function randomizeEnemies_create(){
		if(enemies_container.getNumChildren() < enemy_total){
			x = Math.floor(Math.random() * stage_width);
			y = Math.floor(Math.random() * stage_height);
			createEnemy(x,y);
		}

		setTimeout(function(){
			randomizeEnemies_create();
		}, Math.floor(Math.random() * 3) * 2300);
	}

	function randomizePerks_create(){
		if(perks_container.getNumChildren() < perks_total){
			x = Math.floor(Math.random() * stage_width);
			y = Math.floor(Math.random() * stage_height);
			createPerk(x,y);
		}

		setTimeout(function(){
			randomizePerks_create();
		}, Math.floor(Math.random() * 3) * 1000);
	}

	function randomizePerks(){
		for(var i=perks_total-1; i>=0; i--) {
			x = Math.floor(Math.random() * stage_width);
			y = Math.floor(Math.random() * stage_height);
			createPerk(x,y);
		}
	}

	function createEnemy(_x,_y){
		var enemy = new lib.enemy();
		enemy.set({
			x: _x,
			y: _y,
			regX: 0,
			regY: 0
		});
		enemies_container.addChild(enemy);
	}

	function createPerk(_x,_y){
		var perk = new lib.perk();
		perk.set({
			x: _x,
			y: _y,
			regX: 0,
			regY: 0,
		});
		perks_container.addChild(perk);
	}

	function killEnemy(enemy){
		if(enemy == "undefined") return;
		try{
			enemy.alive = false;
			enemy.gotoAndPlay("frm_die");
		} catch (e) {
			// console.log(e);
		}

		setTimeout(function(){
			enemies_container.removeChild(enemy);
		}, 300);
	}
	function killBullet(bullet){
		showShockwave(bullet.x, bullet.y)
		bullets_container.removeChild(bullet);
	}
	function showShockwave(_x, _y){

		var shockwave = new lib.shockwave();
		shockwave_container.addChild(shockwave);
		shockwave.set({
			x:_x,
			y:_y,
			regX: 0,
			regY: 0,
		})
		createjs.Tween.get(shockwave).to({alpha: .5}, 100)
				.to({alpha:0}, 300)
		setTimeout(function(){
			stage.children[0].removeChild(shockwave);
		}, 400)

	}


	function killPerk(perk){
		if(perk == "undefined") return;
		try{
			perk.alive = false;
			perk.gotoAndPlay("frm_die");
		} catch (e) {
			console.log(e);
		}
		setTimeout(function(){
			perks_container.removeChild(perk);
		}, 250);
	}

	function logger(msg){
		if(DEBUG === true){
			console.log(msg);
			
		}
	}

	var rotation_threshold = 10; // pixels
	function gameLoop(evt){

		checkEnemyCollision();
		checkPerksCollision();
		var player_rotation;
		var _t_keyboard_rotation = 0;
		if(left && right){
			// do nothing
		} else if (left){
			_t_keyboard_rotation -= rotation_speed;
		} else if(right){
			_t_keyboard_rotation += rotation_speed;
		}

		_delta_y = to_mouseY-player.y;
		_delta_x = to_mouseX-player.x;

		var _t_rotation_speed = rotation_speed;

		if(Math.abs(_delta_x) > rotation_threshold || Math.abs(_delta_y) > rotation_threshold){
			_movement_rotation = -90 + Math.atan(_delta_y/_delta_x) / Math.PI * 180;
			if(_delta_x < 0){
				_movement_rotation -= 180
			}
		}

		player_rotation = _movement_rotation + _t_keyboard_rotation;
		// logger(_movement_rotation);
		player.set({
			x:player.x + (_delta_x)* 0.01 *speed,
			y:player.y + (_delta_y)* 0.01 *speed,
			rotation: player_rotation
			// rotation: (player.rotation + (player_rotation - player.rotation)* _t_rotation_speed * 0.05)%360
		});

		moveBullets();


	};

	function moveBullets(){
		var _child_bullets = bullets_container.children;
		var len = _child_bullets.length;

		for (var i = len - 1; i >= 0; i--) {
			var bullet = _child_bullets[i];
			var bulletX = bullet.x;
			var bulletY = bullet.y;
			if(outOfBound(bulletX,bulletY)){
				killBullet(bullet);
				continue;
			}
			var direction = bullet.direction;
			var velocity = bullet.velocity;

			var to_bulletX = bulletX - velocity*Math.sin(toRadians(direction));
			var to_bulletY = bulletY + velocity*Math.cos(toRadians(direction));


			bullet.set({
				x:to_bulletX,
				y:to_bulletY
			});
			// bullet.velocity += 1;
		}
	}


	function toRadians(deg){
		return (deg-180) * Math.PI/180;
	}

	function outOfBound(_x, _y){
		if(_x < 0 || _y < 0 || _x > stage_width || _y > stage_height){
			return true;
		}
		return false;
	}


	function checkBulletsEnemyCollision(enemy, _x,_y){
		var _child_bullets = bullets_container.children;
		var len = _child_bullets.length;

		for (var i = len - 1; i >= 0; i--) {
			var bulletX = _child_bullets[i].x;
			var bulletY = _child_bullets[i].y;

			var dist = getDistance(bulletX, _x, bulletY, _y);
			if(dist <= bullet_enemy_min_dist){

				
				killBullet(_child_bullets[i]);
				killEnemy(enemy);
			}
		}
	}

	function checkEnemyCollision(){
		var _child_enemies = enemies_container.children;
		var len = _child_enemies.length;
		for (var i = len - 1; i >= 0; i--) {
			var enemyX = _child_enemies[i].x;
			var enemyY = _child_enemies[i].y;

			var playerX = player.x;
			var playerY = player.y;

			var dist = getDistance(enemyX, playerX, enemyY, playerY);
			// logger(player_radius);
			if(dist <= player_enemy_min_dist){


				
				killEnemy(_child_enemies[i]);
				stage.removeEventListener('stagemousemove', updateMousePosition);
				to_mouseX = (playerX - (enemyX - playerX)*3);
				to_mouseY = (playerY - (enemyY - playerY)*3);
				speed = 3;
				setTimeout(function(){
					speed = 20
					stage.addEventListener('stagemousemove', updateMousePosition);
					to_mouseX = playerX;
					to_mouseY = playerY;
				}, 1000);
			}

			_child_enemies[i].set({
				x:enemyX + (playerX - enemyX)*enemy_speed/100,
				y:enemyY + (playerY - enemyY)*enemy_speed/100,
			});

			checkBulletsEnemyCollision(_child_enemies[i], enemyX, enemyY);
		}
	}


	function checkPerksCollision(){
		var _child_perks = perks_container.children;
		var len = _child_perks.length;
		for (var i = len - 1; i >= 0; i--) {
			var perkX = _child_perks[i].x;
			var perkY = _child_perks[i].y;

			var playerX = player.x;
			var playerY = player.y;

			var dist = getDistance(perkX, playerX, perkY, playerY);
			// logger(player_radius);
			if(dist <= player_perk_min_dist){
				
				killPerk(_child_perks[i]);
			}
		}
	}

	function getDistance(x1, x2, y1, y2){

		distance = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2))
		return distance;
	}

	
	function handleKeyDown(evt){
		if(!evt){
			var evt = window.event;
		}
		switch(evt.keyCode){
			case 38:
			case 87: up = true; break;
			case 37:
			case 65: left = true; break;
			case 40:
			case 83: down = true; break;
			case 39:
			case 68: right = true; break;
		}
	}

	function handleKeyUp(evt){
		if(!evt){
			var evt = window.event;
		}

		switch(evt.keyCode){
			case 38:
			case 87: up = false; break;
			case 37:
			case 65: left = false; break;
			case 40:
			case 83: down = false; break;
			case 39:
			case 68: right = false; break;
		}
	}

	var max_bullets = 10;
	function handleClicks(){
		if(bullets_container.getNumChildren() < max_bullets){
			createBullet();
		}
	}

	function createBullet(){
		var bullet = new lib.fire_1();
		bullet.set({
			x: player.x,
			y: player.y,
			regX: 0,
			regY: 0
		});
		bullet.velocity = 10;
		bullet.direction = player.rotation;

		bullets_container.addChild(bullet);
	}



}