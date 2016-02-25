/*****************************
* Constants
*****************************/
var CANVAS_WIDTH = 505;
var CANVAS_HEIGHT = 606;

var COL = 101;//width of a grid
var ROW = 83; //height of a grid
var ROW_OFFSET = -20; //adjust the object's y position so that it shows right in the middle of the grid
var COL_OFFSET = 0; //adjust the object's x position so that it shows right in the middle of the grid

var COLLISION_DISTANCE = 10;



/*****************************
* Utility functions
*****************************/

// return the pixel value of a column
// Parameter: numCol, the number of the indicated column.
function col(numCol) {
    return numCol * COL + COL_OFFSET;
}

// return the pixel value of a row
// Parameter: numRow, the number of the indicated row.
function row(numRow) {
    return numRow * ROW + ROW_OFFSET;
}



/*****************************
* Classes
*****************************/

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.reset();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.isCollideWith(player)) {
        player.reset();
    }

    if (this.isOutOfCanvas()) {
        this.reset();
    } else {
        this.x += this.speed * dt;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Judge whether the enemy is out of canvas
Enemy.prototype.isOutOfCanvas = function() {
    return this.x >= CANVAS_WIDTH;
};

// Every time the enemy is out of canvas,
// reset it on the left of the screen,
// reassign it to one of the three paved rows
// and reassign a speed.
//
// NOTE: this function is also used when an enemy is initiated.
Enemy.prototype.reset = function() {
    this.x = col(-1);

    //randomly put the enemy on one of the three paved rows
    this.y = row(Math.ceil(Math.random() * 3));

    //randomly set the enemy's speed between 100 and 500
    this.speed = Math.floor(Math.random() * 400) + 100;
};

// Judge whether enemy collides with the given object (normally the player)
// Parameter: obj, the object that we need to judge whether it collides with this enemy object
Enemy.prototype.isCollideWith = function(obj) {
    var dx = this.x - obj.x;
    var dy = this.y - obj.y;

    if (Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)) < COLLISION_DISTANCE) {
        //Collided
        return true;
    } else {
        //Not collided
        return false;
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.reset();
};

// Update the player's position, required method for game
// Parameter: dt, a time delta between ticks
Player.prototype.update = function(dt) {
    // I have no idea what this method need to do.
    // Player has no arguments that are changed over time

    // Maybe if one want to make fancy effects (character animations etc)
    // This method will be useful.
    // For example the character is dancing
};

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Respond to the keyboard input
// Parameter: key, the key pressed by user
Player.prototype.handleInput = function(key) {

    //Calculate the key input's effect to the player,
    //without having to update the player object.
    var resultX = this.x;
    var resultY = this.y;

    switch(key) {
        case 'left':
            resultX -= COL;
            break;

        case 'right':
            resultX += COL;
            break;

        case 'down':
            resultY += ROW;
            break;

        case 'up':
            resultY -= ROW;
    }

    // Only execute the move when it will NOT move the character out of canvas
    if (!this.willOutOfCanvas(resultX, resultY)) {
        if (this.willOnWater(resultX, resultY)) {
            // Win state.
            // The key press will move the character on the water
            // The requirement is only to reset the character to the initial position.
            // But it can be fancier.
            this.reset();
        } else {
            // Normal state.
            // Neither out of canvas, nor win
            // Simply execute the move
            this.x = resultX;
            this.y = resultY;
        }
    }
};

// Reset the player to the initial position
Player.prototype.reset = function() {
    this.x = col(2);
    this.y = row(5);
};

// Judge if the given x and y will move the player out of canvas
Player.prototype.willOutOfCanvas = function(x, y) {
    if(x < col(0) || x > col(4)) {
        return true;
    } else if (y > row(5) || y < row(0)) {
        return true;
    } else {
        return false;
    }
};

// Judge if the given x and y will move the player on the water
// Currently this function needs y only
// But for consistency and future extension, it is set to require the x anyway.
Player.prototype.willOnWater = function(x, y) {
    return y < row(1);
};



/*****************************
* Objects
*****************************/

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
    new Enemy(),
    new Enemy(),
    new Enemy()
];

var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
