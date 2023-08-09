
import {CENTER_OF_BG_X, CENTER_OF_BG_Y} from '../constant'

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

export default servBall;
