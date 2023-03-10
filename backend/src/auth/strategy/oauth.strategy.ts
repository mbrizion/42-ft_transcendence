import { Strategy } from "passport-oauth2";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OAuthStrategy extends PassportStrategy(Strategy, '42API') {
	constructor(
			private configService : ConfigService) {
		super({
			authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
			tokenURL: 'https://api.intra.42.fr/oauth/token',
			clientID: configService.get('42API_ID'),
			clientSecret: configService.get('42API_SECRET'),
			callbackURL: 'http://localhost:3000/auth',
			state: true,
			scope: ['public']
		});
	}

	async validate(token: string, refreshToken: string) {
		return ({token, refreshToken});
	}
}
