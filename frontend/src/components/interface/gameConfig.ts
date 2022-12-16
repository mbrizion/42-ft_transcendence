import { ObjectSize } from './position';
import PlayerInterface from '../../interfaces/player.interface';


export interface GameConfig {
	paddleSize: ObjectSize,
	paddleOffset: number,
	canvasSize: ObjectSize,
	ballSize: ObjectSize,
	scoreP1: number,
	scoreP2: number,
	p1PosY: number,
	p2PosY: number,
	bgColor: string,
	fgColor: string,
	players: number,
	players2: PlayerInterface[],
};
