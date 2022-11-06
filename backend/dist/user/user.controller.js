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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const dto_1 = require("./dto");
let UserController = class UserController {
    uploadFileAndPassValidation(body, file) {
        return {
            body,
            file: file.buffer.toString(),
        };
    }
};
__decorate([
    (0, common_1.Post)('uploadImage'),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, common_2.UploadedFile)(new common_2.ParseFilePipe({
        validators: [
            new common_2.FileTypeValidator({ fileType: 'jpeg' }),
        ]
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.SampleDto, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "uploadFileAndPassValidation", null);
UserController = __decorate([
    (0, common_1.Controller)('user')
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map