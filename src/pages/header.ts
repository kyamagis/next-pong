

const BG_WIDTH: number = 480;
const BG_HEIGHT: number = 320;
const VIEWBOX: string = `0 0 ${BG_WIDTH} ${BG_HEIGHT}`;
const BALL_DIAMETER: number = 10; // 辺の長さ
const BALL_RADIUS: number = BALL_DIAMETER / 2;
const CENTER_OF_BG_X: number = BG_WIDTH / 2 - BALL_RADIUS;
const CENTER_OF_BG_Y: number = BG_HEIGHT / 2 - BALL_RADIUS;

const PADDLE_HEIGHT = 75;
const PADDLE_WIDTH = 10;
const PADDLE_INIT_POS = (BG_HEIGHT - PADDLE_HEIGHT) / 2;
const RIGHT_PADDLE_X_POS = BG_WIDTH - PADDLE_WIDTH;
const PADDLE_SPEED = 7;
const CPU_SPEED = 4;

type Ball = {
	x: number;
	y: number;
	vx: number;
	vy: number;
}