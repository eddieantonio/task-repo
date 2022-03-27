// Game constants
const FOOD_RADIUS = 10;

let playingGame = false
let start; // undefined is used as a status idk.... it's supposed to be undefined right now
// TODO: finish timing code???
const c = document.getElementById('c');
// TODO: extract contstants for width and height
c.width = 640;
c.height = 640;
let point = 0;
const g = c.getContext('2d');
let d = 'up';
let dx = 20, dy = 20;
let food = { x: getRandomArbitrary(1, 640), y: getRandomArbitrary(1, 640) };
// TODO: extract constants:
// TODO: rename 's' to snake segments?... maybe?
let s = [{ x: 320, y: 320 }];

const MOVE = { 
    'up': (pos) => { return { x: pos.x, y: pos.y - dy } }, 
    'down': (pos) => { return { x: pos.x, y: pos.y + dy } },
    'left': (pos) => { return { x: pos.x - dx, y: pos.y } },
    'right': (pos) => { return { x: pos.x + dx, y: pos.y } }
}


const generateFood = () => {
    // TODO: extract constant for food min something or other.
    const pos = { x: Math.floor(getRandomArbitrary(10, 640)), y: Math.floor(getRandomArbitrary(10, 640)) };
    // TODO: undraw food? why are we throwing it away?
    // Is this why it stays on the screen?
    // TODO: should we be drawing the food here????
    actuallyDrawFood(pos)
    food = pos;
}

const actuallyDrawFood = (pos) => {
    new Circle(pos.x, pos.y, FOOD_RADIUS).draw(g);
}

const drawSnake = () => {
    s.forEach(r => new Rectangle(r.x, r.y, 10, 10).draw(g));
}

const checkIfLegalMove = (s) => {
    return s.every(pos => pos.x > 0 && pos.x < 640 && pos.y > 0 && pos.y < 640);
}

const moveSnake = (timestamp) => {
    if(!playingGame) {
        return;
    }
    if(!start) {
        start = timestamp;
    }

    const oldS = s;
    s = s.map((p, i) => {
        // TODO: index zero is SNAKE_HEAD?
        return i === 0 ? MOVE[d](p) : oldS[i - 1];
    });
    const legal = checkIfLegalMove(s);
    const id = legal && playingGame && window.requestAnimationFrame(moveSnake);
    // Why draw food here?
    actuallyDrawFood(food);

    if(!legal) {
        drawSnake();
        gameOver();
        return;
    }
    if(checkFoodCollision()) {
        generateFood();
        const endOfSnake = s[s.length - 1];
        switch(d) {
            case 'up':
                s.push({ x: endOfSnake.x, y: endOfSnake.y - dy });
                break;
            case 'down':
                s.push({ x: endOfSnake.x, y: endOfSnake.y + dy });
                break;
            case 'left':
                s.push({ x: endOfSnake.x + dx, y: endOfSnake.y });
                break;
            case 'right':
                s.push({ x: endOfSnake.x - dx, y: endOfSnake.y });
                break;
        }
        point += 50;
    }
    drawSnake();
    
}

// TODO : implement Scoreboard? 


const intro = () => {
    g.font = '30px Arial';
    g.fillStyle = 'black';
    
    g.textAlign = 'center';
    
    g.fillText('Play Snake - press Enter to Start', 320, 320);
}

const startGame = () => {
    if(playingGame) {
        s = [{ x: 320, y: 320 }];
        d = 'up';
        generateFood();
        moveSnake();
    }
}

const gameOver = () => {
    playingGame = false;
    g.font = '30px Arial';
    g.fillStyle = 'black';
    g.textAlign = 'center';
    g.fillText(`Game over! You earned ${point} points.`, 320, 320);
    g.fillText(`Press Enter to play again.`, 320, 360);
    setTimeout(() => { 
        if(!playingGame) {
            intro();
        }
    }, 10000);
}

const checkFoodCollision = () => {
    return ((food.x - Math.floor( 5 * Math.PI) < s[0].x ) || (food.x + Math.floor( 5 * Math.PI)) > s[0].x) && 
    ((food.y - Math.floor( 5 * Math.PI) < s[0].y ) || (food.y + Math.floor( 5 * Math.PI)) > s[0].y)
}

window.addEventListener('keydown', (e) => {
    const { key } = e;
    switch(key) {
        case 'Enter':
            e.preventDefault();
            if(!playingGame) {
                playingGame = true;
                startGame();
            }
            break;
        case 's':
        case 'ArrowDown':
            if(d === 'up' && s.length > 1) {
                gameOver();
                return;
            }
            d = 'down';
            break;
        case 'w':
        case 'ArrowUp':
            if(d === 'down' && s.length > 1) {
                gameOver();
                return;
            }
            d = 'up';
            break;
        case 'a':
        case 'ArrowLeft':
            if(d === 'right' && s.length > 1) {
                gameOver();
                return;
            }
            d = 'left';
            break;
        case 'd':
        case 'ArrowRight':
            if(d === 'left' && s.length > 1) {
                gameOver();
                return;
            }
            d = 'right';
            break;
    }
});



intro();

