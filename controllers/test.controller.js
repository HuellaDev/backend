import pool from "../db/config.js";

export const testDB = async (req, res) => {
   let client;
  try {
    // Adquiere una conexión del pool
    client = await pool.connect();
    
    // Ejecuta tu consulta
    const result = await client.query('SELECT * FROM comments');
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error en la consulta', err);
    res.status(500).send('Error interno del servidor');
  } finally {
    // IMPORTANTE: Libera la conexión de vuelta al pool
    if (client) client.release();
  }
};