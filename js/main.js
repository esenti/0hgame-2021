(function() {
 var DEBUG, before, c, clamp, collides, ctx, delta, draw, elapsed, keysDown, keysPressed, load, loading, now, ogre, setDelta, tick, update;

 var BULLET_SPEED = 360.0;
 var ENEMY_SPEED = 50.0;
 var GRAVITY = 0.4;

 c = document.getElementById('draw');

 ctx = c.getContext('2d');

 delta = 0;

 now = 0;

 before = Date.now();

 elapsed = 0;

 loading = 0;

//  DEBUG = false;
 DEBUG = true;

 c.width = 800;

 c.height = 600;

 keysDown = {};

 keysPressed = {};

 images = [];

 audios = [];

 framesThisSecond = 0;
 fpsElapsed = 0;
 fps = 0

 particles = []
 windParticles = []

 fired = false;

 required = -2;
 toNew = 2;
 newTimestamp = 0;
 pressed = false;
 correct = false;
 userTime = 0;
 initial = true;

 window.addEventListener("keydown", function(e) {
   console.log(e.keyCode)
      if((e.keyCode == 65 && required == 0) || (e.keyCode == 83 && required == 1) || (e.keyCode == 68 && required == 2) || (e.keyCode == 70 && required == 3)) {
        pressed = true;
        userTime = Date.now() - newTimestamp;
        correct = true;
        required = -1;
      } else {
        pressed = true;
        correct = false;
        required = -1;
      }

      initial = false;
         keysDown[e.keyCode] = true;
         return keysPressed[e.keyCode] = true;
         }, false);

 window.addEventListener("keyup", function(e) {
         return delete keysDown[e.keyCode];
         }, false);

 setDelta = function() {
     now = Date.now();
     delta = (now - before) / 1000;
     return before = now;
 };

 if (!DEBUG) {
     console.log = function() {
         return null;
     };
 }

 ogre = false;

var player, cog;

init = function() {
  elapsed = 0;

 player = {
   x: 400,
   y: 590,
   w: 100,
   h: 20,
 }

 cog = {
    x: 400,
    y: 400,
 }

  ogre = false;
  particles = []
  windParticles = []

  fired = false;

  for(var i = 0; i < 100; ++i) {
    windParticles.push({
      x: Math.random() * 800,
      y: Math.random() * 600,
      w: 16,
      h: 2,
    })
  }
 }

 tick = function() {
     setDelta();
     elapsed += delta;
     update(delta);
     draw(delta);
     keysPressed = {};
     click = null;
        return window.requestAnimationFrame(tick);
 };

 points = 0;

  speed = 300;
  cspeed = 3;
  wind = -20;

 update = function(delta) {

     framesThisSecond += 1;
     fpsElapsed += delta;

     if(fpsElapsed >= 1) {
        fps = framesThisSecond / fpsElapsed;
        framesThisSecond = fpsElapsed = 0;
     }

     if(!ogre)
     {
       if(pressed) {
        toNew = Math.random() * 5;
        pressed = false;
       }

       if(required < 0) {
        toNew -= delta;
        if(toNew <= 0) {
          required = Math.floor(Math.random() * 3.99);
          newTimestamp = Date.now();
        }
      }
     }
 };

 Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

 draw = function(delta) {
     var bg = "#" + (Math.floor(50 * (Math.sin(elapsed + 1000) + 1))).pad(2) + (Math.floor(50 * (Math.sin(elapsed) + 1))).pad(2) + (Math.floor(50 * (Math.sin(elapsed + 2000) + 1))).pad(2);
     document.getElementsByTagName('html')[0].style.background = bg;

     ctx.fillStyle = bg;
     ctx.fillRect(0, 0, c.width, c.height);

     ctx.fillStyle = "#fafafa";
     ctx.textAlign = "center";

     ctx.strokeStyle = "#bababa";
     ctx.lineWidth = 10;

    // ctx.beginPath();
    // ctx.moveTo(player.x, player.y);
    // ctx.lineTo(cog.x, cog.y + 10);
    // ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "32px Visitor";


        if(required >= 0) {
          ctx.fillText("Press", 400, 100);
        }
        var txt;
    if(required == 0) {
      txt = 'A!';
    } else if(required == 1) {
      txt = 'S!'
    } else if(required == 2) {
      txt = 'D!'
    } else if(required == 3) {
      txt = 'F!'
    } else {
      txt = '';
    }

        ctx.font = "200px Visitor";
    ctx.fillText(txt, 400, 300);

    if(!initial) {
      if(correct) {
        ctx.font = "70px Visitor";
        if(userTime < 300) {
          t = "Great!";
        }
        else if(userTime < 500) {
          t = "Good!";
        }
        else if(userTime < 1000) {
          t = "OK!";
        } else {
          t = "Slow!";
        }
        
        ctx.fillText(t, 400, 440);
        ctx.font = "54px Visitor";
        ctx.fillText(userTime / 1000 + "s", 400, 500);
      } else {
        ctx.font = "70px Visitor";
        ctx.fillText("No!", 400, 440);
      }
    }

     if(ogre) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "20px Visitor";
        ctx.fillText("[r] to restart", 400, 400);
     }
 };

 (function() {
  var targetTime, vendor, w, _i, _len, _ref;
  w = window;
  _ref = ['ms', 'moz', 'webkit', 'o'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  vendor = _ref[_i];
  if (w.requestAnimationFrame) {
  break;
  }
  w.requestAnimationFrame = w["" + vendor + "RequestAnimationFrame"];
  }
  if (!w.requestAnimationFrame) {
  targetTime = 0;
  return w.requestAnimationFrame = function(callback) {
  var currentTime;
  targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
  return w.setTimeout((function() {
          return callback(+(new Date));
          }), targetTime - currentTime);
  };
  }
 })();

 loadImage = function(name, callback) {
    var img = new Image()
    console.log('loading')
    loading += 1
    img.onload = function() {
        console.log('loaded ' + name)
        images[name] = img
        loading -= 1
        if(callback) {
            callback(name);
        }
    }

    img.src = 'img/' + name + '.png'
 }

 load = function() {
     if(loading) {
         window.requestAnimationFrame(load);
     } else {
         window.requestAnimationFrame(tick);
     }
 };

 init();
 load();

}).call(this);
