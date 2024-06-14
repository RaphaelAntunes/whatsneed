"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/phoneRoutes.ts
const express_1 = require("express");
const customeridController_1 = require("../controllers/customeridController");
const router = (0, express_1.Router)();
router.post('/setCustomer', async (req, res) => {
    try {
        const { id, code } = req.body;
        const result = await (0, customeridController_1.setCustomerID)(id, code);
        res.status(200).json({ result });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao definir' });
    }
});
exports.default = router;
