import express from 'express';
import {
    createRoadmap,getAllRoadmaps,getRoadmapsByDomain} from '../controllers/roadmapController.js';

   import  protect from '../middleware/authMiddleware.js';

    const router = express.Router();

    router.post('/add',createRoadmap);

    router.get('/all',getAllRoadmaps);

    router.get('/:domain',getRoadmapsByDomain);

    export default router;