// routes/phoneRoutes.ts
import { Router } from 'express';
import { MakeAndSetCode, ConfirmCode } from '../controllers/PhoneController';

const router = Router();

router.post('/makecode', async (req, res) => {
    try {
        const { id } = req.body;
        const makecode = await MakeAndSetCode(id);
        res.status(200).json({ message: 'Token Inserido com sucesso', makecode });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao definir' });
    }
});

router.post('/confirmcode', async (req, res) => {
    try {
        const { id, code } = req.body;
        const result = await ConfirmCode(id, code);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao definir' });
    }
});

export default router;
