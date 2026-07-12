import {
  Profile,
  LostReport,
  SightingReport,
  AiMatch,
  Photo,
} from "../models/index.js";

export const testDB = async (req, res) => {
  try {
    const lostReports = await LostReport.findAll({
      include: [
        { model: Profile, as: "user" },
        { model: Photo },
      ],
    });

    res.json(lostReports);
  } catch (err) {
    console.error("Error en la consulta", err);
    res.status(500).send("Error interno del servidor");
  }
};

export const testMatches = async (req, res) => {
  try {
    const matches = await AiMatch.findAll({
      include: [{ model: LostReport }, { model: SightingReport }],
    });

    res.json(matches);
  } catch (err) {
    console.error("Error en la consulta", err);
    res.status(500).send("Error interno del servidor");
  }
};