
import {BG_WIDTH, BG_HEIGHT, BALL_DIAMETER, BALL_RADIUS } from '../pages/PongGame/constant'
import {PADDLE_HEIGHT, PADDLE_INIT_POS, PADDLE_SPEED, CPU_SPEED, HadoukenSpeed} from '../pages/PongGame/constant'

import React, { useEffect, useRef, useState } from 'react';

import Ball from '../pages/PongGame/Ball'
import servBall from '@/pages/PongGame/utils';
import calcCollisionWallOrPaddle from '@/pages/PongGame/calcCollisionWallOrPaddle';
import Player from '@/pages/PongGame/Player';
import Hadouken from '@/pages/PongGame/Hadouken';
import gameOver from '@/pages/PongGame/utils/gameOver';

enum Direction {
	Neutral = 0,
	Up = 1,
	Down = 2,
}

enum HadoukenCommand {
	Neutral = 0,
	DownDown = 1,
	UpDown = 2,
	DownRight = 3,
	UpRight = 4,
	DownP = 5,
	Activated = 6
}

const GRAVITATIONAL_ACCELERATION = 0.25;

const initPlayerRef = () => {
	return { paddlePos: PADDLE_INIT_POS, paddleDir: Direction.Neutral, score: 0};
}

const initHadoukenRef = () => {
	return { x: BALL_RADIUS, y: BG_HEIGHT / 2 , vx: 0, vy: 0, command: HadoukenCommand.Neutral};
}

const usePongGame = () => {

	// Next key と レンダリング
	// Nest clacPong 周り.
	const [lendaring, setLendaring] = useState(false);
	const ball = useRef<Ball>(servBall(GRAVITATIONAL_ACCELERATION));
	const isKeyDown = useRef(Direction.Neutral);
	const leftPlayerRef = useRef<Player>(initPlayerRef());
	const leftHadoukenRef = useRef<Hadouken>(initHadoukenRef());
	const rightPlayerRef = useRef<Player>(initPlayerRef());

	const keyUpHandler = (e: KeyboardEvent) => {
		if(e.key === "Up" || e.key === "ArrowUp") {
			isKeyDown.current = Direction.Neutral;
		}
		else if(e.key === "Down" || e.key === "ArrowDown") {
			isKeyDown.current = Direction.Neutral;
			console.log("↓ 離す");
			if (leftHadoukenRef.current.command === HadoukenCommand.DownP) {
				leftHadoukenRef.current.command = HadoukenCommand.UpDown;
				return ;
			}
		}
		else if(e.key === "Right" || e.key === "ArrowRight") {
			console.log("→ 離す");
			if (leftHadoukenRef.current.command ===  HadoukenCommand.UpDown) {
				leftHadoukenRef.current.command = HadoukenCommand.UpRight;
				return ;
			}
		}
		else if(e.key === 'p') {
			console.log("p 離す");
			if (leftHadoukenRef.current.command === HadoukenCommand.UpRight) {
				leftHadoukenRef.current.command = HadoukenCommand.Activated;
				leftHadoukenRef.current.vx = HadoukenSpeed;
				return ;
			}
		}
		
		if (leftHadoukenRef.current.command !== HadoukenCommand.Activated) {
			leftHadoukenRef.current.command = HadoukenCommand.Neutral;
		}
	}

	const keyDownHandler = (e: KeyboardEvent): void => {
		if(e.key === "Up" || e.key === "ArrowUp") {
			isKeyDown.current = Direction.Up;
			leftPlayerRef.current.paddleDir = Direction.Up;
		}
		else if(e.key === "Down" || e.key === "ArrowDown") {
			isKeyDown.current = Direction.Down;
			leftPlayerRef.current.paddleDir = Direction.Down;
			console.log("↓ 押す");
			if (leftHadoukenRef.current.command !== HadoukenCommand.Activated) {
				leftHadoukenRef.current.command = HadoukenCommand.DownDown;
				return ;
			}
		}
		else if(e.key === "Right" || e.key === "ArrowRight") {
			isKeyDown.current = Direction.Neutral;
			leftPlayerRef.current.paddleDir = Direction.Neutral;
			console.log("→ 押す");
			if (leftHadoukenRef.current.command ===  HadoukenCommand.DownDown) {
				leftHadoukenRef.current.command = HadoukenCommand.DownRight;
				return ;
			}
		}
		else if(e.key === 'p') {
			console.log("p 押す");
			if (leftHadoukenRef.current.command === HadoukenCommand.DownRight) {
				leftHadoukenRef.current.command = HadoukenCommand.DownP;
				return ;
			}
		}
		if (leftHadoukenRef.current.command !== HadoukenCommand.Activated) {
			leftHadoukenRef.current.command = HadoukenCommand.Neutral;
		}
	};

	useEffect(() => {
		document.addEventListener('keydown', keyDownHandler, false);
		document.addEventListener('keyup', keyUpHandler, false);
		const interval = setInterval(calcPong, 10); // 10 ms

		return () => {
			document.removeEventListener('keydown', keyDownHandler);
			document.removeEventListener('keyup', keyUpHandler);

			clearInterval(interval);
		};
	}, []);

	const calcBallBehavior = () => {
		const newXPos: number = ball.current.x + ball.current.vx;
		ball.current.vy += ball.current.g;
		const newYPos: number = ball.current.y + ball.current.vy;

		if (newXPos < 0) { // ボールが左端に来たとき
			ball.current = calcCollisionWallOrPaddle(newYPos, ball, leftPlayerRef, rightPlayerRef);
		}
		else if (BG_WIDTH < newXPos + BALL_DIAMETER) { // ボールが右端に来たとき
			ball.current = calcCollisionWallOrPaddle(newYPos, ball, rightPlayerRef, leftPlayerRef);
		}
		else if (newYPos <= 0 || BG_HEIGHT - BALL_DIAMETER <= newYPos) { // ボールが上下の壁に接触したとき
			ball.current.vy *= -1;
			ball.current.g ;
		}
		else {
			ball.current.x = newXPos;
			ball.current.y = newYPos;
		}
	}

	const calcCpuRightPlayerPos = () => {
		if (0 < ball.current.vx && BG_WIDTH / 2 < ball.current.x) {
			if (ball.current.y < rightPlayerRef.current.paddlePos) {
				rightPlayerRef.current.paddlePos -= CPU_SPEED;
			}
			else if (rightPlayerRef.current.paddlePos + PADDLE_HEIGHT < ball.current.y + BALL_DIAMETER) {
				rightPlayerRef.current.paddlePos += CPU_SPEED;
			}
		}
		else if (ball.current.vx < 0) {
			if (rightPlayerRef.current.paddlePos + (PADDLE_HEIGHT / 2) < BG_HEIGHT / 2) {
				rightPlayerRef.current.paddlePos += 1;
			}
			else if (BG_HEIGHT / 2 < rightPlayerRef.current.paddlePos + (PADDLE_HEIGHT / 2)) {
				rightPlayerRef.current.paddlePos -= 1;
			}
		}
	}

	const calcLeftHadoukenPos = () => {
		if (leftHadoukenRef.current.command !== HadoukenCommand.Activated) {
			leftHadoukenRef.current.y = leftPlayerRef.current.paddlePos + PADDLE_HEIGHT / 2;
			return ;
		}
		leftHadoukenRef.current.x += leftHadoukenRef.current.vx;
		if (leftHadoukenRef.current.x + BALL_RADIUS < BG_WIDTH) {
			return ;
		}

		leftHadoukenRef.current.x = BALL_RADIUS;
		leftHadoukenRef.current.y = leftPlayerRef.current.paddlePos + PADDLE_HEIGHT / 2;
		leftHadoukenRef.current.vx = 0;
		leftHadoukenRef.current.command = HadoukenCommand.Neutral;

		if (rightPlayerRef.current.paddlePos <= leftHadoukenRef.current.y && 
			leftHadoukenRef.current.y <= rightPlayerRef.current.paddlePos + PADDLE_HEIGHT) {
			leftPlayerRef.current.score += 1;
			if (3 < leftPlayerRef.current.score) {
				gameOver("Game over");
			}
		}
	}

	const calcLeftPaddlePos = () => {

		if(leftPlayerRef.current.paddleDir === Direction.Up) {
			const newLeftPaddlePos: number = leftPlayerRef.current.paddlePos - PADDLE_SPEED;

			if (newLeftPaddlePos <= 0) {
				leftPlayerRef.current.paddlePos = 0;
			}
			else {
				leftPlayerRef.current.paddlePos = newLeftPaddlePos;
			}
		}
		else if(leftPlayerRef.current.paddleDir === Direction.Down) {
			const newLeftPaddlePos = leftPlayerRef.current.paddlePos + PADDLE_SPEED;

			if (BG_HEIGHT <= newLeftPaddlePos + PADDLE_HEIGHT) {
				leftPlayerRef.current.paddlePos = BG_HEIGHT - PADDLE_HEIGHT;
			}
			else {
				leftPlayerRef.current.paddlePos = newLeftPaddlePos;
			}
		}
		if (isKeyDown.current === Direction.Neutral) {
			leftPlayerRef.current.paddleDir = Direction.Neutral;
		}
	}

	const calcPong = () => {
		calcBallBehavior();
		calcCpuRightPlayerPos();
		calcLeftPaddlePos();
		calcLeftHadoukenPos();
		if (lendaring)
			setLendaring((prevLendaring) => !prevLendaring);
		else
			setLendaring((prevLendaring) => !prevLendaring);
	};

	return { ball, leftPlayerRef, leftHadoukenRef, rightPlayerRef};
}

export default usePongGame;
