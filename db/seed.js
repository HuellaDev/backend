import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import {
  sequelize,
  Profile,
  Organization,
  Animal,
  AnimalProfile,
  LostReport,
  SightingReport,
  Photo,
  AiMatch,
  Comment,
  Notification,
  StatusHistory,
} from "../models/index.js";

const supabaseAdmin = createClient(
  process.env.SUPABASE_PROJECT_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function createAuthUser(email, password) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) throw error;
  return data.user;
}

async function seed() {
  await sequelize.authenticate();
  console.log("Conectado a la base de datos");

  const authUser1 = await createAuthUser("angel.test@huella.dev", "Test1234!");
  const authUser2 = await createAuthUser("maria.test@huella.dev", "Test1234!");
  const authUserOrg = await createAuthUser("refugio.test@huella.dev", "Test1234!");

  console.log("Usuarios de auth creados");

  const profileUser1 = await Profile.create({
    id: authUser1.id,
    full_name: "Angel Rios",
    phone: "9991234567",
    role: "user",
    verified: true,
  });

  const profileUser2 = await Profile.create({
    id: authUser2.id,
    full_name: "Maria Lopez",
    phone: "9997654321",
    role: "user",
    verified: false,
  });

  const profileOrgOwner = await Profile.create({
    id: authUserOrg.id,
    full_name: "Refugio Patitas",
    phone: "9995551234",
    role: "organization",
    verified: true,
  });

  const organization = await Organization.create({
    user_id: profileOrgOwner.id,
    name: "Refugio Patitas Felices",
    address: "Calle Falsa 123, Merida, Yucatan",
    phone: "9995551234",
    type: "refugio",
    verified: true,
  });

  const animal1 = await Animal.create({});
  const animal2 = await Animal.create({});

  const animalProfile1 = await AnimalProfile.create({
    species: "perro",
    breed: "labrador",
    animal_type: "domestico",
    sex: "macho",
    estimated_age_months: 24,
    size: "grande",
    main_color: "dorado",
    secondary_color: "blanco",
    collar: true,
    condition: "sano",
    description: "Perro juguetón, responde al nombre Toby",
  });

  const animalProfile2 = await AnimalProfile.create({
    species: "gato",
    breed: "criollo",
    animal_type: "domestico",
    sex: "hembra",
    estimated_age_months: 12,
    size: "pequeño",
    main_color: "negro",
    secondary_color: null,
    collar: false,
    condition: "asustadiza",
    description: "Gata negra con una mancha blanca en la pata",
  });

  const lostReport = await LostReport.create({
    animal_id: animal1.id,
    profile_id: animalProfile1.id,
    user_id: profileUser1.id,
    pet_name: "Toby",
    contact_phone: "9991234567",
    last_seen_location: { type: "Point", coordinates: [-89.6237, 20.9674] },
    search_radius_meters: 2000,
    reward_amount: 500,
    status: "activo",
    anonymous: false,
  });

  const sightingReport = await SightingReport.create({
    animal_id: animal1.id,
    profile_id: animalProfile1.id,
    user_id: profileUser2.id,
    anonymous: false,
    location: { type: "Point", coordinates: [-89.6201, 20.9701] },
    status: "activo",
  });

  const sightingReport2 = await SightingReport.create({
    animal_id: animal2.id,
    profile_id: animalProfile2.id,
    user_id: profileUser2.id,
    anonymous: true,
    location: { type: "Point", coordinates: [-89.615, 20.98] },
    status: "activo",
  });

  await Photo.create({
    lost_report_id: lostReport.id,
    uploaded_by: profileUser1.id,
    url: "https://picsum.photos/seed/toby1/600/400",
    is_primary: true,
    ai_processed: true,
    width: 600,
    height: 400,
    file_size: 102400,
    mime_type: "image/jpeg",
  });

  await Photo.create({
    sighting_report_id: sightingReport.id,
    uploaded_by: profileUser2.id,
    url: "https://picsum.photos/seed/toby2/600/400",
    is_primary: true,
    ai_processed: true,
    width: 600,
    height: 400,
    file_size: 98304,
    mime_type: "image/jpeg",
  });

  await AiMatch.create({
    lost_report_id: lostReport.id,
    sighting_report_id: sightingReport.id,
    similarity: 0.87,
    fur_similarity: 0.9,
    color_similarity: 0.85,
    shape_similarity: 0.88,
    face_similarity: 0.82,
    confidence: 0.86,
    ai_model: "huella-vision-v1",
    status: "pendiente",
  });

  await Comment.create({
    user_id: profileUser2.id,
    report_type: "lost_report",
    report_id: lostReport.id,
    comment: "Creo que lo vi cerca del parque esta mañana",
    location: { type: "Point", coordinates: [-89.6195, 20.9698] },
  });

  await Notification.create({
    user_id: profileUser1.id,
    type: "match_found",
    title: "Posible coincidencia encontrada",
    message: "Encontramos un avistamiento que podría coincidir con Toby",
    is_read: false,
  });

  await StatusHistory.create({
    report_type: "lost_report",
    report_id: lostReport.id,
    previous_status: null,
    new_status: "activo",
    user_id: profileUser1.id,
  });

  console.log("Seed completado con éxito");
  console.log({
    authUsers: {
      angel: { email: "angel.test@huella.dev", password: "Test1234!", id: authUser1.id },
      maria: { email: "maria.test@huella.dev", password: "Test1234!", id: authUser2.id },
      refugio: { email: "refugio.test@huella.dev", password: "Test1234!", id: authUserOrg.id },
    },
    lostReport: lostReport.id,
    sightingReports: [sightingReport.id, sightingReport2.id],
  });

  process.exit(0);
}

seed().catch((err) => {
  console.error("Error corriendo el seed:", err);
  process.exit(1);
});