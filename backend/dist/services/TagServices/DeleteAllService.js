"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Tag_1 = __importDefault(require("../../models/Tag"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const DeleteAllService = async () => {
    await Tag_1.default.findAll();
    if (!Tag_1.default) {
        throw new AppError_1.default("ERR_NO_TAG_FOUND", 404);
    }
    await Tag_1.default.destroy({ where: {} });
};
exports.default = DeleteAllService;
