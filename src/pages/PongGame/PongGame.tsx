
import styles from '@/styles/Home.module.css'

import React, { useRef, useEffect, useState } from 'react';

import {BG_WIDTH, BG_HEIGHT, VIEWBOX, BALL_DIAMETER, BALL_RADIUS, CENTER_OF_BG_X, CENTER_OF_BG_Y} from './constant'
import {PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_INIT_POS, RIGHT_PADDLE_X_POS, PADDLE_SPEED, CPU_SPEED} from './constant'

type Ball = {
	x: number;
	y: number;
	vx: number;
	vy: number;
}

const servBall = () => {
	const now = new Date();
	const seconds = now.getSeconds();
	const seed = seconds % 4;

	switch(seed) {
		case 0:
			return {x: CENTER_OF_BG_X, y: CENTER_OF_BG_Y, vx: 2, vy: 2};
		case 1:
			return {x: CENTER_OF_BG_X, y: CENTER_OF_BG_Y, vx: -2, vy: 2};
		case 2:
			return {x: CENTER_OF_BG_X, y: CENTER_OF_BG_Y, vx: 2, vy: -2};
		default:
			return {x: CENTER_OF_BG_X, y: CENTER_OF_BG_Y, vx: -2, vy: -2};
	}
}

const changeBallSpeedAndAngle = (newYPos: number, 
								prevBall: Ball, 
								paddlePos: number) => {
	const centerOfBall = newYPos + BALL_RADIUS;
	let directionOfBall = 1;

	if (0 < prevBall.vx) {
		directionOfBall = -1;
	}

	if (centerOfBall < paddlePos + 5) {
		return { x: prevBall.x, y: prevBall.y, vx: directionOfBall * 3, vy: -6};
	}
	else if (centerOfBall < paddlePos + 30) {
		return { x: prevBall.x, y: prevBall.y, vx: directionOfBall * 2, vy: -2};
	}
	else if (centerOfBall < paddlePos + 45) {
		return { x: prevBall.x, y: prevBall.y, vx: directionOfBall * 20, vy: 0};
	}
	else if (centerOfBall <= paddlePos + 70) {
		return { x: prevBall.x, y: prevBall.y, vx: directionOfBall * 2, vy: 2};
	}
	else if (paddlePos + 70 < centerOfBall) {
		return { x: prevBall.x, y: prevBall.y, vx: directionOfBall * 3, vy: 6};
	}
	return { x: prevBall.x, y: prevBall.y, vx: directionOfBall * 10, vy: 0};
}

const gameOver = (message: string) => {
	alert(message);
	document.location.reload();
}

type SetScore = (score: React.SetStateAction<number>) => void;
const calcCollisionWallOrPaddle = (newYPos: number, 
									paddlePos: number, 
									prevBall: Ball,
									setScore: SetScore) => {
	if (newYPos + BALL_DIAMETER < paddlePos || paddlePos + PADDLE_HEIGHT < newYPos) {
		setScore((prevScore: number) => {
			const nowScore = prevScore + 1;
			if (3 < nowScore) {
				gameOver("Game over");
			}
			return nowScore;
		});
		return servBall();
	}
	return changeBallSpeedAndAngle(newYPos, prevBall, paddlePos);
}



const PongGame: React.FC = () => {

	// カスタムフック
	const [ball, setBall] = useState(servBall());
	const [leftPaddlePos, setLeftPaddlePos] = useState(PADDLE_INIT_POS);
	const [rightPaddlePos, setRightPaddlePos] = useState(PADDLE_INIT_POS);

	const [rightScore, setRightScore] = useState(0);
	const [leftScore, setLeftScore] = useState(0);

	const [upPressedRightPaddle, setUpPressedRightPaddle] = useState(false);
	const [downPressedRightpaddle, setDownPressedRightPaddle] = useState(false);

	// useRef の登録と参照
	// react strict mode

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
		setBall((prevBall) => {
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

	return (
		<div className={styles.title}>
			<h1>Pong Game</h1>
			<svg
				width={BG_WIDTH}
				height={BG_HEIGHT}
				viewBox={VIEWBOX}
				xmlns="http://www.w3.org/2000/svg"
				className={styles.background}
			>
			<line x1={BG_WIDTH / 2} y1={0} x2={BG_WIDTH / 2} y2={BG_HEIGHT} className={styles.centerline}/>
			<rect width={BALL_DIAMETER} height={BALL_DIAMETER} x={ball.x} y={ball.y} className={styles.ball}/>
			<rect width={PADDLE_WIDTH} height={PADDLE_HEIGHT} x={0} y={leftPaddlePos} className={styles.ball}/>
			<rect width={PADDLE_WIDTH} height={PADDLE_HEIGHT} x={RIGHT_PADDLE_X_POS} y={rightPaddlePos} className={styles.ball}/>
			<text id="text" x={BG_WIDTH / 2 -70 - 24} y={70} className={styles.score}>
				{leftScore}
			</text>
			<text id="text" x={BG_WIDTH / 2 +70} y={70} className={styles.score}>
				{rightScore}
			</text>
		</svg>
		</div>
	);
}

export default PongGame;
