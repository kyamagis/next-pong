
import {BG_WIDTH, BG_HEIGHT, BALL_DIAMETER } from '../pages/PongGame/constant'
import {PADDLE_HEIGHT, PADDLE_INIT_POS, PADDLE_SPEED, CPU_SPEED} from '../pages/PongGame/constant'

import React, { useEffect, useRef, useState } from 'react';

import Ball from '../pages/PongGame/Ball'
import servBall from '@/pages/PongGame/utils';
import calcCollisionWallOrPaddle from '@/pages/PongGame/calcCollisionWallOrPaddle';
import Player from '@/pages/PongGame/Player';

enum Direction {
	Neutral = 0,
	Up = 1,
	Down = 2,
}

const initPlayerRef = () => {
	return { paddlePos: PADDLE_INIT_POS, paddleDir: Direction.Neutral, score: 0};
}

const usePongGame = () => {

	// const [ball, setBall] = useState<Ball>(servBall());
	const [lendaring, setLendaring] = useState(false);
	const ball = useRef<Ball>(servBall());
	const isKeyDown = useRef(Direction.Neutral);
	const leftPlayerRef = useRef<Player>(initPlayerRef());
	const rightPlayerRef = useRef<Player>(initPlayerRef());

	const keyUpHandler = (e: KeyboardEvent) => {
		if(e.key === "Up" || e.key === "ArrowUp") {
			isKeyDown.current = Direction.Neutral;
			// leftPlayerRef.current.paddleDir = Direction.Neutral;
		}
		else if(e.key === "Down" || e.key === "ArrowDown") {
			isKeyDown.current = Direction.Neutral;
			// leftPlayerRef.current.paddleDir = Direction.Neutral;
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
	}, [lendaring]);

	const calcBallBehavior = () => {
		const newXPos = ball.current.x + ball.current.vx;
		const newYPos = ball.current.y + ball.current.vy;

		if (newXPos < 0) { // ボールが左端に来たとき
			ball.current = calcCollisionWallOrPaddle(newYPos, ball, leftPlayerRef, rightPlayerRef);
		}
		else if (BG_WIDTH < newXPos + BALL_DIAMETER) { // ボールが右端に来たとき
			ball.current = calcCollisionWallOrPaddle(newYPos, ball, rightPlayerRef, leftPlayerRef);
		}
		else if (newYPos <= 0 || BG_HEIGHT - BALL_DIAMETER <= newYPos) { // ボールが上下の壁に接触したとき
			ball.current.vy *= -1;
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

	const calcLeftPaddlePos = () => {

		if(leftPlayerRef.current.paddleDir === Direction.Up) {
			const newLeftPaddlePos = leftPlayerRef.current.paddlePos - PADDLE_SPEED;

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
		if (lendaring)
			setLendaring(false);
		else
			setLendaring(true);
	};

	return { ball, leftPlayerRef, rightPlayerRef};
}

export default usePongGame;
