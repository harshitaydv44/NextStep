import Roadmap from '../models/Roadmap.js';
export const createRoadmap = async(req, res) => {
    try{
        const {
            title,
            description,
            domain,
            steps,
            createdBy
        } = req.body;

        const newRoadmap = new Roadmap({
            title,
            description,
            domain,
            steps,
            createdBy
        });

        await newRoadmap.save();
        res.status(201).json({message: 'Roadmap created successfully', roadmap: newRoadmap});
    } catch (err) {
        res.status(500).json({message: 'server error', error: err.message});
    }
};

export const getAllRoadmaps = async (req, res) => {
    try {
      const roadmaps = await Roadmap.find();
      res.status(200).json(roadmaps);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
 
export const getRoadmapsByDomain = async(req, res) => {
    try{
        const {domain} = req.params;
        const roadmaps = await Roadmap.find({domain});
        res.status(200).json(roadmaps);
    } catch (err) {
        res.status(500).json({message:'server error', error: err.message});
    }
};