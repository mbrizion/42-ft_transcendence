import { Body, Controller, Delete, Get, Post, UseGuards, Query, Res } from "@nestjs/common";
import { Response } from 'express';
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./decorators";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

	// UseGuards determine if the request will be handled
	@UseGuards(AuthGuard('42API'))
	@Get('42api/login')
	login42() {}

	@Get('intra/getMe')
	async getIntraUser (
			@Query() query: {token: string},
			@Res({ passthrough: true} ) res: Response
		): Promise<string> {
		return (this.authService.getIntraUser(query.token, res));
	}

	@Get('google2FA/signup')
	async signup2FA(@Body() body: {email: string}) {
		return (this.authService.signup2FA(body.email));
	}

	@Post('google2FA/login')
	verify2FA(@Body() body: {email: string, code: string}) {
		return (this.authService.verify2FA(body));
	}
}
