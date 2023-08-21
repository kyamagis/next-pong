import { resolveTypeReferenceDirective } from 'typescript';
import Ball from './Ball';
import Player from './Player';
import { BALL_DIAMETER, BALL_RADIUS } from './constant'
import { PADDLE_HEIGHT } from './constant'

import servBall from "./utils";

const zeroGravity = (newYPos: number, 
	ball:  React.RefObject<Ball>, 
	paddlePos: number) => {

	const centerOfBall = newYPos + BALL_RADIUS;
	let directionOfBall = 1;

	if (ball.current === null) {
		gameOver("ball.current is null");
		return servBall(0);
	}

	if (0 < ball.current.vx) {
		directionOfBall = -1;
	}

	if (centerOfBall < paddlePos + 5) {
		return { x: ball.current.x, y: ball.current.y, vx: directionOfBall * 3, vy: -6, g: ball.current.g};
	}
	else if (centerOfBall < paddlePos + 30) {
		return { x: ball.current.x, y: ball.current.y, vx: directionOfBall * 2, vy: -2, g: ball.current.g};
	}
	else if (centerOfBall < paddlePos + 45) {
		return { x: ball.current.x, y: ball.current.y, vx: directionOfBall * 20, vy: 0, g: ball.current.g};
	}
	else if (centerOfBall <= paddlePos + 70) {
		return { x: ball.current.x, y: ball.current.y, vx: directionOfBall * 2, vy: 2, g: ball.current.g};
	}
	else if (paddlePos + 70 < centerOfBall) {
		return { x: ball.current.x, y: ball.current.y, vx: directionOfBall * 3, vy: 6, g: ball.current.g};
	}
	return { x: ball.current.x, y: ball.current.y, vx: directionOfBall * 10, vy: 0, g: ball.current.g};
}

const onGravity = (newYPos: number, 
				ball:  React.RefObject<Ball>, 
				paddlePos: number) => {
	
	const centerOfBall = newYPos + BALL_RADIUS;
	let directionOfBall = 1;
	let	coefficientOfVy = 1;

	if (ball.current === null) {
		gameOver("ball.current is null");
		return servBall(0);
	}

	if (0 < ball.current.vx) {
		directionOfBall = -1;
	}

	if (centerOfBall < paddlePos + 5) {
		return { x: ball.current.x, y: ball.current.y, vx: directionOfBall * 3, vy: -8, g: ball.current.g};
	}
	else if (centerOfBall < paddlePos + 30) {
		return { x: ball.current.x, y: ball.current.y, vx: directionOfBall * 2, vy: -2, g: ball.current.g};
	}
	else if (centerOfBall < paddlePos + 45) {
		return { x: ball.current.x, y: ball.current.y, vx: directionOfBall * 10, vy: -5, g: ball.current.g};
	}
	else if (centerOfBall <= paddlePos + 70) {
		return { x: ball.current.x, y: ball.current.y, vx: directionOfBall * 2, vy: -4, g: ball.current.g};
	}
	else if (paddlePos + 70 < centerOfBall) {
		return { x: ball.current.x, y: ball.current.y, vx: directionOfBall * 3, vy: -8, g: ball.current.g};
	}
	return { x: ball.current.x, y: ball.current.y, vx: directionOfBall * 10, vy: 0, g: ball.current.g};
}

const changeBallSpeedAndAngle = (newYPos: number, 
								ball:  React.RefObject<Ball>, 
								paddlePos: number) => {
	if (ball.current === null) {
		gameOver("ball.current is null");
		return servBall(0);
	}
	if (ball.current.g === 0) {
		return zeroGravity(newYPos, ball, paddlePos);
	}
	return onGravity(newYPos, ball, paddlePos);
}

const gameOver = (message: string) => {
	alert(message);
	document.location.reload();
}

const calcCollisionWallOrPaddle = (newYPos: number, 
									ball:  React.RefObject<Ball>, 
									myPlayerRef: React.RefObject<Player>,
									opponentPlayerRef: React.RefObject<Player>) => {
	if (myPlayerRef.current === null || opponentPlayerRef.current === null || ball.current === null) {
		gameOver("PlayerRef.current is null");
		return servBall(0);
	}
	if (newYPos + BALL_DIAMETER < myPlayerRef.current.paddlePos || myPlayerRef.current.paddlePos + PADDLE_HEIGHT < newYPos) {
		opponentPlayerRef.current.score += 1;
		if (3 < opponentPlayerRef.current.score) {
			gameOver("Game over");
		}
		return servBall(ball.current.g);
	}
	return changeBallSpeedAndAngle(newYPos, ball, myPlayerRef.current.paddlePos);
}

export default calcCollisionWallOrPaddle;
