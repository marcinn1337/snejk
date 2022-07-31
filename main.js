// MAIN =========
const createRandomCoord = (min, max, divider) => {
	return (
		(Math.floor(Math.random() * (Math.floor(max / divider) - Math.ceil(min / divider) + 1)) +
			Math.ceil(min / divider)) *
		divider
	)
}
let gameState = 'paused'
const gameStateInfo = document.querySelector('.game-state')
const board = document.querySelector('.board')
const scoreInfo = document.querySelector('.score')
let score = 0
let direction = 'toLeft'
let speed, oldPosX, oldPosY, exchangerX, exchangerY
///////////////////////////

// SNAKE CODE =========
const snake = []
const head = {
	posX: 400,
	posY: 400,
}
class Tail {
	constructor(x, y) {
		this.posX = x
		this.posY = y
	}
}
snake.push(head)
///////////////////////////

// SNAKE GRAPH =========
const snakeBoxes = []
const headBox = document.querySelector('.head')
headBox.style.transform = `translate(400px, 400px)`
snakeBoxes.push(headBox)
const createTails = () => {
	const testTailPierwszy = new Tail(440, 400)
	const testTailDrugi = new Tail(480, 400)
	snake.push(testTailPierwszy)
	snake.push(testTailDrugi)

	const tailBox1 = document.createElement('div')
	tailBox1.classList.add('tail')
	tailBox1.style.transform = `translate(${440}px, ${400}px)`
	snakeBoxes.push(tailBox1)

	const tailBox2 = document.createElement('div')
	tailBox2.classList.add('tail')
	tailBox2.style.transform = `translate(${480}px, ${400}px)`
	snakeBoxes.push(tailBox2)

	board.appendChild(tailBox1)
	board.appendChild(tailBox2)
}
///////////////////////////

// APPLE =========
const appleBox = document.querySelector('.apple')
let appleX = createRandomCoord(0, 960, 40)
let appleY = createRandomCoord(0, 960, 40)
appleBox.style.transform = `translate(${appleX}px, ${appleY}px)`
///////////////////////////

const dirToBottom = () => {
	if (direction !== 'toTop') {
		return 'toBottom'
	}
	return 'toTop'
}

const dirToTop = () => {
	if (direction !== 'toBottom') {
		return 'toTop'
	}
	return 'toBottom'
}

const dirToRight = () => {
	if (direction !== 'toLeft') {
		return 'toRight'
	}
	return 'toLeft'
}

const dirToLeft = () => {
	if (direction !== 'toRight') {
		return 'toLeft'
	}
	return 'toRight'
}

const checkClick = e => {
	switch (e.key) {
		case 'ArrowUp':
			direction = dirToTop()
			break
		case 'ArrowRight':
			direction = dirToRight()
			break
		case 'ArrowDown':
			direction = dirToBottom()
			break
		case 'ArrowLeft':
			direction = dirToLeft()
			break
		case 'Enter':
			if (gameState === 'paused') {
				startGame()
			}
			break
		case 'Escape':
			if (gameState === 'running') {
				stopGame()
			}
			break
	}
}

const stopGame = () => {
	clearInterval(speed)
	gameStateInfo.style.display = 'block'
	gameState = 'paused'
}

const startGame = () => {
	gameStateInfo.style.display = 'none'
	speed = setInterval(moveSnake, 100)
	gameState = 'running'
}

const moveTail = () => {
	for (let i = 1; i < snake.length; i++) {
		exchangerX = snake[i].posX
		exchangerY = snake[i].posY
		snake[i].posX = oldPosX
		snake[i].posY = oldPosY
		snakeBoxes[i].style.transform = `translate(${oldPosX}px, ${oldPosY}px)`
		oldPosX = exchangerX
		oldPosY = exchangerY
	}
}

const createNewTailBox = () => {
	let x, y

	if (direction === 'toRight') {
		x = snake[snake.length - 1].posX - snake.length * 60
		y = snake[snake.length - 1].posY
	} else if (direction === 'toLeft') {
		x = snake[snake.length - 1].posX + snake.length * 60
		y = snake[snake.length - 1].posY
	} else if (direction === 'toTop') {
		x = snake[snake.length - 1].posX
		y = snake[snake.length - 1].posY + snake.length * 60
	} else if (direction === 'toBottom') {
		x = snake[snake.length - 1].posX
		y = snake[snake.length - 1].posY - snake.length * 60
	}

	const tail = new Tail(x, y)
	snake.push(tail)

	const tailBox = document.createElement('div')
	snakeBoxes.push(tailBox)
	tailBox.classList.add('tail')

	board.appendChild(tailBox)
}

const moveSnake = () => {
	const checkIfHitTheWall = () => {
		if (snake[0].posX < 0) {
			snake[0].posX = 1000
		} else if (snake[0].posX > 960) {
			snake[0].posX = -40
		}

		if (snake[0].posY < 0) {
			snake[0].posY = 1000
		} else if (snake[0].posY > 960) {
			snake[0].posY = -40
		}
	}
	const checkIfEatApple = () => {
		if (snake[0].posX === appleX && snake[0].posY === appleY) {
			createNewTailBox()
			appleX = createRandomCoord(0, 960, 40)
			appleY = createRandomCoord(0, 960, 40)
			appleBox.style.transform = `translate(${appleX}px, ${appleY}px)`
			score += 10
			scoreInfo.textContent = `Score: ${score}`
		}
	}
	const checkIfHitTheTail = () => {
		for (let i = 1; i < snake.length; i++) {
			if (snake[0].posX === snake[i].posX && snake[0].posY === snake[i].posY) {
				gameStateInfo.textContent = 'GAME OVER'
				gameStateInfo.classList.add('game-over')
				stopGame()
			}
		}
	}
	switch (direction) {
		case 'toLeft':
			oldPosX = snake[0].posX
			oldPosY = snake[0].posY
			snake[0].posX -= 40
			checkIfHitTheWall()
			snakeBoxes[0].style.transform = `translate(${snake[0].posX}px, ${snake[0].posY}px)`
			checkIfHitTheTail()
			checkIfEatApple()
			moveTail()
			break
		case 'toRight':
			oldPosX = snake[0].posX
			oldPosY = snake[0].posY
			snake[0].posX += 40
			checkIfHitTheWall()
			snakeBoxes[0].style.transform = `translate(${snake[0].posX}px, ${snake[0].posY}px)`
			checkIfHitTheTail()
			checkIfEatApple()
			moveTail()
			break
		case 'toTop':
			oldPosX = snake[0].posX
			oldPosY = snake[0].posY
			snake[0].posY -= 40
			checkIfHitTheWall()
			snakeBoxes[0].style.transform = `translate(${snake[0].posX}px, ${snake[0].posY}px)`
			checkIfHitTheTail()
			checkIfEatApple()
			moveTail()
			break
		case 'toBottom':
			oldPosX = snake[0].posX
			oldPosY = snake[0].posY
			snake[0].posY += 40
			checkIfHitTheWall()
			snakeBoxes[0].style.transform = `translate(${snake[0].posX}px, ${snake[0].posY}px)`
			checkIfHitTheTail()
			checkIfEatApple()
			moveTail()
			break
	}
}

createTails()
document.addEventListener('keyup', checkClick)
