import { resolveTypeReferenceDirective } from 'typescript';
import Ball from './Ball';
import Player from './Player';
import { BALL_DIAMETER, BALL_RADIUS } from './constant'
import { PADDLE_HEIGHT } from './constant'

import servBall from "./utils";
import gameOver from './utils/gameOver';

const setBall = (ball:  React.RefObject<Ball>, reflectedVx: number, reflectedVy: number) => {
	if (ball.current === null) {
		gameOver("ball.current is null");
		return servBall(0);
	}
	return { x: ball.current.x, y: ball.current.y, vx: reflectedVx, vy: reflectedVy, g: ball.current.g};
}

const zeroGravity = (newYPos: number, 
	ball:  React.RefObject<Ball>, 
	paddlePos: number) => {

	const centerOfBall: number = newYPos + BALL_RADIUS;
	let directionOfBall: number = 1;

	if (ball.current === null) {
		gameOver("ball.current is null");
		return servBall(0);
	}

	if (0 < ball.current.vx) {
		directionOfBall = -1;
	}

	if (centerOfBall < paddlePos + 5) {
		return setBall(ball, directionOfBall * 3, -6);
	}
	else if (centerOfBall < paddlePos + 30) {
		return setBall(ball, directionOfBall * 2, -2);
	}
	else if (centerOfBall < paddlePos + 45) {
		return setBall(ball, directionOfBall * 20, 0);
	}
	else if (centerOfBall <= paddlePos + 70) {
		return setBall(ball, directionOfBall * 2, 2);
	}
	else if (paddlePos + 70 < centerOfBall) {
		return setBall(ball, directionOfBall * 3, 6);
	}
	return setBall(ball, directionOfBall * 10, 0);
}

const onGravity = (newYPos: number, 
				ball:  React.RefObject<Ball>, 
				paddlePos: number) => {
	
	const centerOfBall: number = newYPos + BALL_RADIUS;
	let directionOfBall: number = 1;

	if (ball.current === null) {
		gameOver("ball.current is null");
		return servBall(0);
	}

	if (0 < ball.current.vx) {
		directionOfBall = -1;
	}

	if (centerOfBall < paddlePos + 5) {
		return setBall(ball, directionOfBall * 4, -8);
	}
	else if (centerOfBall < paddlePos + 30) {
		return setBall(ball, directionOfBall * 3, -6);
	}
	else if (centerOfBall < paddlePos + 45) {
		return setBall(ball, directionOfBall * 10, -5);
	}
	else if (centerOfBall <= paddlePos + 70) {
		return setBall(ball, directionOfBall * 3, -4);
	}
	else if (paddlePos + 70 < centerOfBall) {
		return setBall(ball, directionOfBall * 4, -8);
	}
	return setBall(ball, directionOfBall * 10, 0);
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
