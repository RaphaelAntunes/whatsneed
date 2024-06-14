// routes/phoneRoutes.ts
import { Router } from 'express';
import { setCustomerID } from '../controllers/customeridController';

const router = Router();

router.post('/setCustomer', async (req, res) => {
    try {
        const { user_id, code } = req.body;  
        const result = await setCustomerID(user_id, code);
        res.status(200).json({success: 'Customer_ID definido' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao definir' });
    }
});

export default router;
