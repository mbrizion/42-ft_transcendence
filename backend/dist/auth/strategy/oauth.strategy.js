"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthStrategy = void 0;
const passport_oauth2_1 = require("passport-oauth2");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let OAuthStrategy = class OAuthStrategy extends (0, passport_1.PassportStrategy)(passport_oauth2_1.Strategy, '42API') {
    constructor(prismaService, configService) {
        super({
            authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
            tokenURL: 'https://api.intra.42.fr/oauth/token',
            clientID: configService.get('42API_ID'),
            clientSecret: configService.get('42API_SECRET'),
            callbackURL: 'http://localhost:3000/auth/42api/redirect',
            state: true,
            scope: ['public']
        });
        this.prismaService = prismaService;
        this.configService = configService;
    }
    async validate(token, refreshToken) {
        console.log("VALIDATE");
        return ({ token, refreshToken });
    }
};
OAuthStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], OAuthStrategy);
exports.OAuthStrategy = OAuthStrategy;
//# sourceMappingURL=oauth.strategy.js.map