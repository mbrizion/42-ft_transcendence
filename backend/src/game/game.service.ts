import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { OppenentsInterface, PlayerInterface } from './interfaces';

@Injectable()
export class GameService {
	constructor(
			private prismaService: PrismaService,
			private userService: UserService
	) {}

	async getQueue(): Promise<string[]> {
		const queue = await this.prismaService.matching.findMany();
		const len = queue.length;
		let users: string[] = new Array(len);
		for (let i = 0; i < len; ++i)
			users[i] = await this.userService.getNameById(queue[i].userId);
		return (users);
	}

	async getGameList(): Promise<string[]> {
		const games = await this.prismaService.game.findMany();
		const len = games.length;
		let versus: string[] = new Array(len);
		for (let i = 0; i < len; ++i) {
			let players = await this.prismaService.player.findMany({
				where: {
					gameId: games[i].id
				}
			});
			versus[i] = this.getStrGame(players);
		}
		return (versus);
	}

	async addClientToMatchingQueue(socketId: string): Promise<void> {
		const matchingUser = await this.prismaService.user.update({
			where: {
				socketId,
			},
			data: {
				matching: {
					create: {}
				}
			}
		});
	}

	async startGame(oppenents: OppenentsInterface): Promise<string> {
		const	updated = await this.prismaService.user.updateMany({
			where: {
				OR: [{ socketId: oppenents.one }, { socketId: oppenents.two }],
			},
			data: {
				inGame: true
			}
		});
		const	players = await this.prismaService.user.findMany({
			where: {
				OR: [{ socketId: oppenents.one }, { socketId: oppenents.two }],
			},
		});
		//const deleteUsers = await this.prismaService.matching.deleteMany({
		//	where: {
		//		OR: [{ user: players[0] }, { user: players[1] }],
		//	},
		//});
		const game = await this.prismaService.game.create({
			data: {
				players: {
					create: [
						{ userId: players[0].id, displayName: players[0].displayName },
						{ userId: players[1].id, displayName: players[1].displayName }
					]
				}
			}
		});
		const gameRoom = "game".concat(String(game.id));
		return (gameRoom);
	}

	async	updateScore(userId: number, n: number): Promise<string> {
		const	player = await this.prismaService.player.update({
			where: {
				userId,
			},
			data: {
				score: {
					increment: n
				},
			},
		});
		const gameRoom = "game".concat(String(player.gameId));
		return (gameRoom);
	}

	findOne(id: string) {
		const game = this.prismaService.game.findUnique({
			where: {
				id: Number(id)
			}
		});
		return ({game});
	}

	getStrGame(players: PlayerInterface[]): string {
		let strGame = players[0].displayName.concat(" vs ");
		strGame = strGame.concat(players[1].displayName);
		return (strGame);
	}

	async getPlayersBySIds(socketIds: string[]): Promise<PlayerInterface[]> {
		const users = await this.prismaService.user.findMany({
			where: {
				OR: [{ socketId: socketIds[0] }, { socketId: socketIds[1] }],
			}
		});
		const	players = await this.prismaService.player.findMany({
			where: {
				OR: [{ userId: users[0].id }, { userId: users[1].id }]
			}
		});
		return (players);
	}

	async isPlayingBySId(SId: string): Promise<boolean> {
		const	user = await this.prismaService.user.findUnique({
			where: {
				socketId: SId
			},
			select: {
				inGame: true
			}
		});
			return (user.inGame);
	}

	async	getPlayerByOneSId(SId: string): Promise<PlayerInterface[]> {
		const user = await this.prismaService.user.findUnique({
			where: {
				socketId: SId
			}
		});
		const player = await this.prismaService.player.findUnique({
			where: {
				userId: user.id
			}
		});
		const game = await this.prismaService.game.findUnique({
			where: {
				id: player.gameId
			},
			select: {
				players: true
			}
		});
		return (game.players);
	}
}
