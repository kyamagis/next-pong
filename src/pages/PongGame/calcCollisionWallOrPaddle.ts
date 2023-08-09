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
export default calcCollisionWallOrPaddle;