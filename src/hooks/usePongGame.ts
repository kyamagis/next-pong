
import {BG_WIDTH, BG_HEIGHT, BALL_DIAMETER } from '../pages/PongGame/constant'
import {PADDLE_HEIGHT, PADDLE_INIT_POS, PADDLE_SPEED, CPU_SPEED} from '../pages/PongGame/constant'

import React, { useEffect, useState } from 'react';

import Ball from '../pages/PongGame/Ball'
import servBall from '@/pages/PongGame/utils';
import calcCollisionWallOrPaddle from '@/pages/PongGame/calcCollisionWallOrPaddle';

const usePongGame = () => {

	// カスタムフック
	const [ball, setBall] = useState(servBall());
	const [leftPaddlePos, setLeftPaddlePos] = useState(PADDLE_INIT_POS);
	const [rightPaddlePos, setRightPaddlePos] = useState(PADDLE_INIT_POS);

	const [rightScore, setRightScore] = useState(0);
	const [leftScore, setLeftScore] = useState(0);

	const [upPressedRightPaddle, setUpPressedRightPaddle] = useState(false);
	const [downPressedRightpaddle, setDownPressedRightPaddle] = useState(false);

	const keyUpHandler = (e: KeyboardEvent) => {
		if(e.key == "Up" || e.key == "ArrowUp") {
			setUpPressedRightPaddle((prevUpPressedRightPaddle) => false);
		}
		else if(e.key == "Down" || e.key == "ArrowDown") {
			setDownPressedRightPaddle((prevdownPressedRightpaddle) => false);
		}
	}

	const keyDownHandler = (e: KeyboardEvent): void => {
		if(e.key == "Up" || e.key == "ArrowUp") {
			setUpPressedRightPaddle((prevUpPressedRightPaddle) => true);
		}
		else if(e.key == "Down" || e.key == "ArrowDown") {
			setDownPressedRightPaddle((prevdownPressedRightpaddle) => true);
		}
	};
	
	useEffect(() => {
		const interval = setInterval(calcPong, 10);

		// dev だと useEffctは二回呼ばれる
		// build だと一回呼ばれる
		console.log("setInterval " + interval);
		document.addEventListener('keydown', keyDownHandler, false);
		document.addEventListener('keyup', keyUpHandler, false);

		return () => {
			document.removeEventListener('keydown', keyDownHandler);
			document.removeEventListener('keyup', keyUpHandler);
			console.log("clearInterval " + interval);
			clearInterval(interval);
		};
	}, [ball.x])

	const calcBallBehavior = () => {
		setBall((prevBall: Ball) => {
			const newXPos = prevBall.x + prevBall.vx;
			const newYPos = prevBall.y + prevBall.vy;

			// console.log(newXPos);
			// newXposが２回同時に同じ値を表示
			// setBall関数が同時に２回呼ばれている．
			if (newXPos < 0) { // ボールが左端に来たとき
				return calcCollisionWallOrPaddle(newYPos, 
												leftPaddlePos, 
												prevBall, 
												setRightScore);
				
			}
			else if (BG_WIDTH < newXPos + BALL_DIAMETER) { // ボールが右端に来たとき
				return calcCollisionWallOrPaddle(newYPos, 
												rightPaddlePos, 
												prevBall, 
												setLeftScore);
			}
			if (newYPos <= 0 || BG_HEIGHT - BALL_DIAMETER <= newYPos) { // ボールが上下の壁に接触したとき
				return { ...prevBall, vy: -prevBall.vy };
			}
			return { ...prevBall, x: newXPos, y: newYPos };
		});
	}

	const calcCpuRightPaddlePos = () => {
		setRightPaddlePos((prevRightPaddlePos) => {
			if (0 < ball.vx && BG_WIDTH / 2 < ball.x) {
				if (ball.y < prevRightPaddlePos) {
					return prevRightPaddlePos - CPU_SPEED;
				}
				else if (prevRightPaddlePos + PADDLE_HEIGHT < ball.y + BALL_DIAMETER) {
					return prevRightPaddlePos + CPU_SPEED;
				}
			}
			else if (ball.vx < 0) {
				if (prevRightPaddlePos + (PADDLE_HEIGHT / 2) < BG_HEIGHT / 2) {
					return prevRightPaddlePos + 1;
				}
				else if (BG_HEIGHT / 2 < prevRightPaddlePos + (PADDLE_HEIGHT / 2)) {
					return prevRightPaddlePos - 1;
				}
			}
			return prevRightPaddlePos;
		});
	}

	const calcLeftPaddlePos = () => {
		if(upPressedRightPaddle) {
			setLeftPaddlePos((prevLeftPaddlePos) => (prevLeftPaddlePos - PADDLE_SPEED));
			if (leftPaddlePos <= 0){
				setLeftPaddlePos((prevLeftPaddlePos) => 0);
			}
		}
		else if(downPressedRightpaddle) {
			setLeftPaddlePos((prevLeftPaddlePos) => (prevLeftPaddlePos + PADDLE_SPEED));
			if (BG_HEIGHT <= leftPaddlePos + PADDLE_HEIGHT) {
				setLeftPaddlePos((prevLeftPaddlePos) => (BG_HEIGHT - PADDLE_HEIGHT));
			}
		}
	}

	const calcPong = () => {
		calcBallBehavior();
		calcCpuRightPaddlePos();
		calcLeftPaddlePos();
	};

	return { ball, leftPaddlePos, rightPaddlePos, rightScore, leftScore };
}

export default usePongGame;