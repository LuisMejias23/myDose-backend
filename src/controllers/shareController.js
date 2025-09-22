
import ShareableConsultation from '../models/ShareableConsultation.js';


export const saveConsultation = async (req, res) => {
    try {
        const { symptom, age, weight, temperature, recommendations } = req.body;
        
       
        if (!symptom || !weight || age === undefined || !recommendations) {
            return res.status(400).json({ error: 'Missing required data.' });
        }

        const newConsultation = new ShareableConsultation({
            symptom,
            age,
            weight,
            temperature,
            recommendations
        });

        const savedConsultation = await newConsultation.save();
        
        res.status(201).json({ shareId: savedConsultation._id });

    } catch (error) {
        console.error('Error saving consultation:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// Controlador para obtener una consulta por su ID
export const getSharedConsultation = async (req, res) => {
    try {
        const { id } = req.params;
        const consultation = await ShareableConsultation.findById(id);

        if (!consultation) {
            return res.status(404).json({ message: 'Consultation not found or expired.' });
        }

        res.status(200).json(consultation);

    } catch (error) {
        console.error('Error fetching consultation:', error);
        res.status(500).json({ error: 'Server error' });
    }
};