"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCustomerID = void 0;
// controllerController.ts
const User_1 = __importDefault(require("../models/User"));
const setCustomerID = async (userId, customer_id) => {
    try {
        const user = await User_1.default.findByPk(userId);
        if (user) {
            user.customer_id = customer_id;
            await user.save();
            return user;
        }
    }
    catch (error) {
        throw new Error('Erro salvar customer_id');
    }
};
exports.setCustomerID = setCustomerID;
