import sequelize from "../db/sequelize.js";

import ProfileFactory from "./Profile.js";
import OrganizationFactory from "./Organization.js";
import AnimalFactory from "./Animal.js";
import AnimalProfileFactory from "./AnimalProfile.js";
import LostReportFactory from "./LostReport.js";
import SightingReportFactory from "./SightingReport.js";
import PhotoFactory from "./Photo.js";
import AiMatchFactory from "./AiMatch.js";
import CommentFactory from "./Comment.js";
import NotificationFactory from "./Notification.js";
import StatusHistoryFactory from "./StatusHistory.js";

const Profile = ProfileFactory(sequelize);
const Organization = OrganizationFactory(sequelize);
const Animal = AnimalFactory(sequelize);
const AnimalProfile = AnimalProfileFactory(sequelize);
const LostReport = LostReportFactory(sequelize);
const SightingReport = SightingReportFactory(sequelize);
const Photo = PhotoFactory(sequelize);
const AiMatch = AiMatchFactory(sequelize);
const Comment = CommentFactory(sequelize);
const Notification = NotificationFactory(sequelize);
const StatusHistory = StatusHistoryFactory(sequelize);

Profile.hasOne(Organization, { foreignKey: "user_id" });
Organization.belongsTo(Profile, { foreignKey: "user_id" });

Profile.hasMany(LostReport, { foreignKey: "user_id" });
LostReport.belongsTo(Profile, { foreignKey: "user_id", as: "user" });

Profile.hasMany(SightingReport, { foreignKey: "user_id" });
SightingReport.belongsTo(Profile, { foreignKey: "user_id", as: "user" });

Profile.hasMany(Photo, { foreignKey: "uploaded_by" });
Photo.belongsTo(Profile, { foreignKey: "uploaded_by", as: "uploader" });

Profile.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(Profile, { foreignKey: "user_id" });

Profile.hasMany(Notification, { foreignKey: "user_id" });
Notification.belongsTo(Profile, { foreignKey: "user_id" });

Profile.hasMany(AiMatch, { foreignKey: "reviewed_by", as: "reviewedMatches" });
AiMatch.belongsTo(Profile, { foreignKey: "reviewed_by", as: "reviewer" });

Animal.hasMany(LostReport, { foreignKey: "animal_id" });
LostReport.belongsTo(Animal, { foreignKey: "animal_id" });

Animal.hasMany(SightingReport, { foreignKey: "animal_id" });
SightingReport.belongsTo(Animal, { foreignKey: "animal_id" });

AnimalProfile.hasMany(LostReport, { foreignKey: "profile_id" });
LostReport.belongsTo(AnimalProfile, { foreignKey: "profile_id" });

AnimalProfile.hasMany(SightingReport, { foreignKey: "profile_id" });
SightingReport.belongsTo(AnimalProfile, { foreignKey: "profile_id" });

LostReport.hasMany(Photo, { foreignKey: "lost_report_id" });
Photo.belongsTo(LostReport, { foreignKey: "lost_report_id" });

SightingReport.hasMany(Photo, { foreignKey: "sighting_report_id" });
Photo.belongsTo(SightingReport, { foreignKey: "sighting_report_id" });

LostReport.hasMany(AiMatch, { foreignKey: "lost_report_id" });
AiMatch.belongsTo(LostReport, { foreignKey: "lost_report_id" });

SightingReport.hasMany(AiMatch, { foreignKey: "sighting_report_id" });
AiMatch.belongsTo(SightingReport, { foreignKey: "sighting_report_id" });

export {
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
};