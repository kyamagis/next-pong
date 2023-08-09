
import styles from '@/styles/Home.module.css'

import { 
		BG_WIDTH, 
		BG_HEIGHT, 
		VIEWBOX, 
		BALL_DIAMETER 
} from './constant'

import { PADDLE_HEIGHT, PADDLE_WIDTH, RIGHT_PADDLE_X_POS } from './constant'

import usePongGame from '@/hooks/usePongGame'

const PongGame: React.FC = () => {

	const { ball, leftPaddlePos, rightPaddlePos, rightScore, leftScore } = usePongGame();

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

// いくつかのオプションを考えなければならない.

// ボールの速度を変えられる.
// マッチポイントの設定がきる．

// パドルをy軸だけでなくx軸にも動かせる.
// ボールの弾道予測を画面に表示. 
// あるキーを押している間にボールがパドルに接触したら, ボールをグラップしそのキーを離したらボールが相手側に飛んで行く
// 画面の下側に重力を発生させボールの弾道を常に放物線にする.
