import express from 'express'
import verifyToken from '../middleware/verifyToken.js';
import isCoordinator from '../middleware/isCoordinator.js';
import { jobController } from '../controllers/job.controller.js';

const router=express.Router();

router.post('/',verifyToken,isCoordinator,jobController.createJob);

export default router;