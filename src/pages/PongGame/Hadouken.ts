enum HadoukenCommand {
	Neutral = 0,
	DownDown = 1,
	UpDown = 2,
	DownRight = 3,
	UpRight = 4,
	DownP = 5,
	Activated = 6
}

type Hadouken = {
	x: number;
	y: number;
	vx: number;
	vy: number;
    command: HadoukenCommand;
}

export default Hadouken;