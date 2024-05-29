"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPhone = exports.ConfirmCode = exports.MakeAndSetCode = exports.ChangeUserPhone = void 0;
// controllerController.ts
const User_1 = __importDefault(require("../models/User"));
const ChangeUserPhone = async (userId, newPhone) => {
    try {
        const user = await User_1.default.findByPk(userId);
        if (user) {
            user.phone = newPhone;
            await user.save();
            return user;
        }
        else {
            return null; // Retorna null se o usuário não for encontrado
        }
    }
    catch (error) {
        throw new Error('Erro ao mudar o telefone do usuário');
    }
};
exports.ChangeUserPhone = ChangeUserPhone;
const MakeAndSetCode = async (userId) => {
    try {
        const user = await User_1.default.findByPk(userId);
        if (user) {
            if (user.confirmedphone === 'true') {
                // Se confirmedphone for true, não faz nada e retorna o usuário
                return user;
            }
            if (user.confirmedphone && user.confirmedphone.length === 6) {
                // Se confirmedphone tem 6 dígitos, retorna o valor existente
                return user;
            }
            if (user.confirmedphone === null || user.confirmedphone === 'false') {
                // Gera um código de 6 dígitos aleatórios
                const generateCode = () => {
                    return Math.floor(100000 + Math.random() * 900000).toString();
                };
                // Define o código gerado
                user.confirmedphone = generateCode();
                await user.save();
            }
            return user;
        }
        else {
            return null; // Retorna null se o usuário não for encontrado
        }
    }
    catch (error) {
        throw new Error('Erro ao definir token');
    }
};
exports.MakeAndSetCode = MakeAndSetCode;
const ConfirmCode = async (userId, code) => {
    try {
        const user = await User_1.default.findByPk(userId);
        if (user) {
            if (user.confirmedphone === 'true') {
                return { status: 201, message: 'Essa conta já foi confirmada anteriormente' };
            }
            if (user.confirmedphone == null || user.confirmedphone == '') {
                return { status: 500, message: 'Não foi possível confirmar o código, entre em contato com um administrador' };
            }
            if (user.confirmedphone && user.confirmedphone.length === 6) {
                if (user.confirmedphone == code) {
                    user.confirmedphone = 'true';
                    user.save();
                    return { status: 200, message: 'Telefone vinculado com sucesso' };
                }
                else {
                    return { status: 300, message: 'Código incorreto' };
                }
            }
        }
        else {
            return { status: 404, message: 'Usuário não encontrado' };
        }
    }
    catch (error) {
        throw new Error('Erro ao definir token');
    }
};
exports.ConfirmCode = ConfirmCode;
const setPhone = async (userId, phone) => {
    try {
        const user = await User_1.default.findByPk(userId);
        if (user) {
            user.phone = phone;
            await user.save();
            return user;
        }
    }
    catch (error) {
        throw new Error('Erro ao definir token');
    }
};
exports.setPhone = setPhone;
