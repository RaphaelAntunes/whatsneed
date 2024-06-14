"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../../models/User"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const Queue_1 = __importDefault(require("../../models/Queue"));
const Company_1 = __importDefault(require("../../models/Company"));
const ShowUserService = async (id) => {
    const user = await User_1.default.findByPk(id, {
        attributes: [
            "name",
            "id",
            "email",
            "phone",
            "confirmedphone",
            'customer_id',
            "companyId",
            "profile",
            "super",
            "tokenVersion",
            "whatsappId",
            "allTicket"
        ],
        include: [
            { model: Queue_1.default, as: "queues", attributes: ["id", "name", "color"] },
            { model: Company_1.default, as: "company", attributes: ["id", "name"] }
        ]
    });
    if (!user) {
        throw new AppError_1.default("ERR_NO_USER_FOUND", 404);
    }
    return user;
};
exports.default = ShowUserService;
