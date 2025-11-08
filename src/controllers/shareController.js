import ShareableConsultation from "../models/ShareableConsultation.js";

export const saveConsultation = async (req, res) => {
  try {
    const { symptom, age, weight, temperature, aiResponse } = req.body;

    if (!symptom || !weight || age === undefined || !aiResponse) {
      return res.status(400).json({ error: "Missing required data." });
    }

    const newConsultation = new ShareableConsultation({
      symptom,
      age,
      weight,
      temperature,
      recommendations: Array.isArray(aiResponse) ? aiResponse : [aiResponse],
    });

    const savedConsultation = await newConsultation.save();
    console.log("✅ Consulta guardada con ID:", savedConsultation._id);

    res.status(201).json({ shareId: savedConsultation._id });
  } catch (error) {
    console.error("Error saving consultation:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const getSharedConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = await ShareableConsultation.findById(id);

    if (!consultation) {
      return res
        .status(404)
        .json({ message: "Consultation not found or expired." });
    }

    res.status(200).json(consultation);
  } catch (error) {
    console.error("Error fetching consultation:", error);
    res.status(500).json({ error: "Server error" });
  }
};
