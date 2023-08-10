
enum Direction {
	Neutral = 0,
	Up = 1,
	Down = 2,
}

type Player = {
	paddlePos: number;
	paddleDir: Direction;
	score: number
}

export default Player;