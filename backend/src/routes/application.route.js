import express from 'express'
import verifyToken from '../middleware/verifyToken.js';
import {applyController} from '../controllers/application.controller.js';

const router=express.Router();

router.post('/',verifyToken,applyController.applyJob);

export default router;