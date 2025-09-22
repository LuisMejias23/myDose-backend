// src/controllers/consultationController.js

import Symptom from "../models/Symtom.js"; 


export const getSymptoms = async (req, res) => { // <-- Se hizo asíncrona
  try {
   
    const symptoms = await Symptom.find({});
    // Mapear los resultados para obtener solo el nombre del síntoma
    const symptomsList = symptoms.map(item => item.symptom);
    res.json(symptomsList);
  } catch (error) {
    console.error("Error fetching symptoms:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

export const getMedicationRecommendation = async (req, res) => {
  const { symptom, age, weight, temperature } = req.body;

  try {
    if (!symptom || !weight || age === undefined) {
      return res
        .status(400)
        .json({ error: "Symptom, age, and weight are required." });
    }

    if (
      symptom.toLowerCase() === "fever" &&
      temperature !== undefined &&
      age <= 3 &&
      temperature >= 38
    ) {
      return res.status(200).json({
        recommendations: [
          {
            name: "Immediate Medical Attention",
            dose: "Consult a doctor immediately.",
            recommendations:
              "For babies 3 months or younger, a temperature of 38°C or higher requires immediate medical consultation.",
          },
        ],
      });
    }

    if (
      symptom.toLowerCase() === "fever" &&
      temperature !== undefined &&
      age > 3 &&
      age <= 12 &&
      temperature >= 39
    ) {
      return res.status(200).json({
        recommendations: [
          {
            name: "Medical Consultation Recommended",
            dose: "Consult a doctor.",
            recommendations:
              "For children 3-12 months, a temperature of 39°C or higher is cause for a medical consultation.",
          },
        ],
      });
    }

    const symptomDocument = await Symptom.findOne({
      symptom: { $regex: new RegExp(symptom, "i") },
    });

    if (!symptomDocument) {
      return res
        .status(404)
        .json({ message: "Symptom not found in our database." });
    }

    const recommendedMedications = symptomDocument.medications.filter(
      (medication) => {
        if (
          symptomDocument.symptom.toLowerCase() === "fever" &&
          symptomDocument.requiredTemperature
        ) {
          return temperature >= symptomDocument.requiredTemperature;
        }
        return true;
      }
    );

    if (recommendedMedications.length === 0) {
      return res
        .status(404)
        .json({ message: "No suitable medication found for this symptom." });
    }

    const finalRecommendations = recommendedMedications.map((medication) => {
      let doseMessage = "";

      if (medication.dose.type === "weight" && medication.dose.amountPerKg) {
        const calculatedDose = Math.min(
          medication.dose.amountPerKg * weight,
          medication.dose.maxDose
        );
        doseMessage = `${calculatedDose.toFixed(2)} mg per dose`;
      } else if (medication.dose.type === "fixed" && medication.dose.amount) {
        doseMessage = `${medication.dose.amount} mg per dose`;
      } else if (medication.dose.type === "topical") {
        doseMessage = medication.recommendations;
      }

      return {
        name: medication.name,
        dose: doseMessage,
        recommendations: medication.recommendations,
      };
    });

    res.status(200).json({ recommendations: finalRecommendations });
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ error: "An unexpected error occurred on the server." });
  }
};