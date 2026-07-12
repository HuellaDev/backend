import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { sequelize, Profile } from "../models/index.js";

const supabaseAdmin = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const TEST_EMAILS = [
  "angel.test@huella.dev",
  "maria.test@huella.dev",
  "refugio.test@huella.dev",
];

async function cleanup() {
  await sequelize.authenticate();

  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) throw error;

  const testUsers = data.users.filter((u) => TEST_EMAILS.includes(u.email));

  for (const user of testUsers) {
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    console.log(`Usuario de auth eliminado: ${user.email}`);
  }

  console.log("Limpieza completada (los datos relacionados se eliminan en cascada si tienes ON DELETE CASCADE configurado)");
  process.exit(0);
}

cleanup().catch((err) => {
  console.error("Error en la limpieza:", err);
  process.exit(1);
});