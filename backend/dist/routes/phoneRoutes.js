"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/phoneRoutes.ts
const express_1 = require("express");
const PhoneController_1 = require("../controllers/PhoneController");
const router = (0, express_1.Router)();
router.post('/makecode', async (req, res) => {
    try {
        const { id } = req.body;
        const makecode = await (0, PhoneController_1.MakeAndSetCode)(id);
        res.status(200).json({ message: 'Token Inserido com sucesso', makecode });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao definir' });
    }
});
router.post('/confirmcode', async (req, res) => {
    try {
        const { id, code } = req.body;
        const result = await (0, PhoneController_1.ConfirmCode)(id, code);
        res.status(200).json({ result });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao definir' });
    }
});
exports.default = router;
