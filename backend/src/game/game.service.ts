import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GameService implements OnModuleInit {
	constructor(private prismaService: PrismaService) {}

	matchingUsers: number = 0;

	async onModuleInit() {
		const count = await this.prismaService.matching.count({});
			this.matchingUsers = count;
	}

//	async addToQueue(id: number) {
//		const updateUser = await this.prismaService.user.update({
//			where: {
//				id
//			},
//			data: {
//				matching: {
//					create: {}
//				}
//			}
//		});
//	}

	async showQueue() {
		const queue = await this.prismaService.matching.findMany();
		return ({queue});
	}

	async addClientToMatchingQueue() {
		++this.matchingUsers;
		console.log({"matchingUsers": this.matchingUsers});
		const matching = await this.prismaService.matching.create({
			data: {
				title: "hey"
			}
		});
		console.log({matching});
	}
}
