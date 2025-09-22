const pediatricMedicines = [
  {
    "symptom": "Fever",
    "requiredTemperature": 38,
    "medications": [
      {
        "name": "Paracetamol (Acetaminophen)",
        "dose": {
          "type": "weight",
          "amountPerKg": 15, // mg por kg de peso
          "maxDose": 1000 // mg por dosis
        },
        "ages": {
          "min": 0,
          "max": null
        },
        "recommendations": "Administer every 4-6 hours. Do not exceed 5 doses in 24 hours. Recommended for babies from birth."
      },
      {
        "name": "Ibuprofen",
        "dose": {
          "type": "weight",
          "amountPerKg": 10,
          "maxDose": 400
        },
        "ages": {
          "min": 6,
          "max": null
        },
        "recommendations": "Administer every 6-8 hours. Take with food. Not recommended for children under 6 months."
      }
    ]
  },
  {
    "symptom": "Common Cold",
    "medications": [
      {
        "name": "Nasal Saline Solution",
        "dose": {
          "type": "fixed",
          "amount": null
        },
        "ages": {
          "min": 0,
          "max": null
        },
        "recommendations": "Apply 1-2 drops in each nostril as needed to clear nasal passages."
      },
      {
        "name": "Paracetamol (Acetaminophen)",
        "dose": {
          "type": "weight",
          "amountPerKg": 15,
          "maxDose": 1000
        },
        "ages": {
          "min": 0,
          "max": null
        },
        "recommendations": "For relief of pain and fever associated with the cold. Follow fever dose guidelines."
      }
    ]
  },
  {
    "symptom": "Mild Pain",
    "medications": [
      {
        "name": "Paracetamol (Acetaminophen)",
        "dose": {
          "type": "weight",
          "amountPerKg": 15,
          "maxDose": 1000
        },
        "ages": {
          "min": 0,
          "max": null
        },
        "recommendations": "Useful for headaches or minor muscle aches. Follow fever dose guidelines."
      },
      {
        "name": "Ibuprofen",
        "dose": {
          "type": "weight",
          "amountPerKg": 10,
          "maxDose": 400
        },
        "ages": {
          "min": 6,
          "max": null
        },
        "recommendations": "Effective for inflammatory pain. Take with food."
      }
    ]
  }
];

export default pediatricMedicines;