
enum Direction {
	Neutral = 0,
	Up = 1,
	Down = 2,
}

enum Hadouken {
	Neutral = 0,
	DownDown = 1,
	UpDown = 2,
	DownRight = 3,
	UpRight = 4,
	DownP = 5,
	Activated = 6
}

type Player = {
	paddlePos: number;
	paddleDir: Direction;
	score: number;
}

export default Player;