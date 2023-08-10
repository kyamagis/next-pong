import Player from './Player';
import { BALL_DIAMETER, BALL_RADIUS } from './constant'
import { PADDLE_HEIGHT } from './constant'

import servBall from "./utils";

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
									prevBall: Ball, 
									myPlayerRef: React.RefObject<Player>,
									opponentPlayerRef: React.RefObject<Player>) => {
	if (myPlayerRef.current === null || opponentPlayerRef.current === null) {
		gameOver("PlayerRef.current is null");
		return servBall();
	}
	if (newYPos + BALL_DIAMETER < myPlayerRef.current.paddlePos || myPlayerRef.current.paddlePos + PADDLE_HEIGHT < newYPos) {
		opponentPlayerRef.current.score += 1;
		if (3 < opponentPlayerRef.current.score) {
			gameOver("Game over");
		}
		return servBall();
	}
	return changeBallSpeedAndAngle(newYPos, prevBall, myPlayerRef.current.paddlePos);
}

export default calcCollisionWallOrPaddle;