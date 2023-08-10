
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

	const [ball, setBall] = useState<Ball>(servBall());
	const leftPlayerRef = useRef<Player>(initPlayerRef());
	const rightPlayerRef = useRef<Player>(initPlayerRef());

	// paddle = { pos, key }; useState, useRefのハイブリッドで作れるか？
	// 押したキーをフレームまたぐまで保持するようにする.

	const keyUpHandler = (e: KeyboardEvent) => {
		if(e.key === "Up" || e.key === "ArrowUp") {
			leftPlayerRef.current.paddleDir = Direction.Neutral;
		}
		else if(e.key === "Down" || e.key === "ArrowDown") {
			leftPlayerRef.current.paddleDir = Direction.Neutral;
		}
	}

	const keyDownHandler = (e: KeyboardEvent): void => {
		if(e.key === "Up" || e.key === "ArrowUp") {
			leftPlayerRef.current.paddleDir = Direction.Up;
		}
		else if(e.key === "Down" || e.key === "ArrowDown") {
			leftPlayerRef.current.paddleDir = Direction.Down;
		}
	};

	useEffect(() => {
		const interval = setInterval(calcPong, 10); // 10 ms

		// dev だと useEffctは二回呼ばれる
		// build だと一回呼ばれる

		document.addEventListener('keydown', keyDownHandler, false);
		document.addEventListener('keyup', keyUpHandler, false);

		return () => {
			document.removeEventListener('keydown', keyDownHandler);
			document.removeEventListener('keyup', keyUpHandler);

			clearInterval(interval);
		};
	}, [ball.x]);

	const calcBallBehavior = () => {
		setBall((prevBall: Ball) => {
			const newXPos = prevBall.x + prevBall.vx;
			const newYPos = prevBall.y + prevBall.vy;

			// console.log(newXPos);
			// newXposが２回同時に同じ値を表示
			// setBall関数が同時に２回呼ばれている．
			if (newXPos < 0) { // ボールが左端に来たとき
				return calcCollisionWallOrPaddle(newYPos, prevBall, leftPlayerRef, rightPlayerRef);
			}
			else if (BG_WIDTH < newXPos + BALL_DIAMETER) { // ボールが右端に来たとき
				return calcCollisionWallOrPaddle(newYPos, prevBall, rightPlayerRef, leftPlayerRef);
			}
			if (newYPos <= 0 || BG_HEIGHT - BALL_DIAMETER <= newYPos) { // ボールが上下の壁に接触したとき
				return { ...prevBall, vy: -prevBall.vy };
			}
			return { ...prevBall, x: newXPos, y: newYPos };
		});
	}

	const calcCpuRightPlayerPos = () => {
		if (0 < ball.vx && BG_WIDTH / 2 < ball.x) {
			if (ball.y < rightPlayerRef.current.paddlePos) {
				rightPlayerRef.current.paddlePos -= CPU_SPEED;
			}
			else if (rightPlayerRef.current.paddlePos + PADDLE_HEIGHT < ball.y + BALL_DIAMETER) {
				rightPlayerRef.current.paddlePos += CPU_SPEED;
			}
		}
		else if (ball.vx < 0) {
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
		//leftPlayerRef.current.paddleDir = Direction.Neutral;
	}

	// const calcLeftPaddlePos = () => {
	// 	if(upPressedLeftPaddle) {
	// 		setLeftPaddlePos((prevLeftPaddlePos) => (prevLeftPaddlePos - PADDLE_SPEED));
	// 		if (leftPaddlePos <= 0){
	// 			setLeftPaddlePos((prevLeftPaddlePos) => 0);
	// 		}
	// 	}
	// 	else if(downPressedLeftPaddle) {
	// 		setLeftPaddlePos((prevLeftPaddlePos) => (prevLeftPaddlePos + PADDLE_SPEED));
	// 		if (BG_HEIGHT <= leftPaddlePos + PADDLE_HEIGHT) {
	// 			setLeftPaddlePos((prevLeftPaddlePos) => (BG_HEIGHT - PADDLE_HEIGHT));
	// 		}
	// 	}
	// }

	const calcPong = () => {
		calcBallBehavior();
		calcCpuRightPlayerPos();
		calcLeftPaddlePos();
	};

	return { ball, leftPlayerRef, rightPlayerRef};
}

export default usePongGame;