"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Contact_1 = __importDefault(require("../../models/Contact"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const DeleteAllContactService = async () => {
    await Contact_1.default.findAll();
    if (!Contact_1.default) {
        throw new AppError_1.default("ERR_NO_CONTACT_FOUND", 404);
    }
    await Contact_1.default.destroy({ where: {} });
};
exports.default = DeleteAllContactService;
