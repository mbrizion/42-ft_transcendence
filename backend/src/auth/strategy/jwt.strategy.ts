import { Strategy, ExtractJwt } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, Req } from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
			private configService: ConfigService,
			private prismaService: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET')
		});
	}

	private static extractJWT(@Req() req: Request): string | null {
		if (req.cookies && 'jwtToken' in req.cookies)
			return (req.cookies.jwtToken);
    return null;
  }

	async validate(payload: {id: number}) {
		const user = await this.prismaService.user.findUnique({
			where: {
				id: payload.id
			},
		});
		return (user);
	}
}
