import crypto from "crypto";
import { cookies } from "next/headers";
import { Types } from "mongoose";
import { AdminSessionModel } from "@/models/AdminSession";
import { AdminUserModel } from "@/models/AdminUser";
import { connectToDatabase } from "@/lib/mongodb";

const SESSION_COOKIE = "safepath-admin-session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const RESET_CODE_DURATION_MS = 10 * 60 * 1000;
const DEFAULT_ADMIN_EMAIL = "pranavchitalkar2005@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "Admin@123";

function hashText(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"));
}

export function getConfiguredAdminEmail() {
  return (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL).trim().toLowerCase();
}

export async function ensureAdminUserSeeded() {
  await connectToDatabase();
  const count = await AdminUserModel.countDocuments();
  if (count > 0) return;
  const email = getConfiguredAdminEmail();
  const password = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  await AdminUserModel.create({ email, passwordHash: hashPassword(password) });
}

export async function authenticateAdmin(email: string, password: string) {
  await ensureAdminUserSeeded();
  const normalizedEmail = email.trim().toLowerCase();
  const user = await AdminUserModel.findOne({ email: normalizedEmail });
  if (!user) return null;
  return verifyPassword(password, user.passwordHash) ? user : null;
}

export async function authenticateAdminWithPasswordOnly(password: string) {
  return authenticateAdmin(getConfiguredAdminEmail(), password);
}

export async function createAdminSession(userId: string) {
  await connectToDatabase();
  const token = crypto.randomBytes(48).toString("hex");
  const tokenHash = hashText(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await AdminSessionModel.create({ userId: new Types.ObjectId(userId), tokenHash, expiresAt });
  return { token, expiresAt };
}

export async function clearAdminSession(token: string) {
  await connectToDatabase();
  await AdminSessionModel.deleteOne({ tokenHash: hashText(token) });
}

export async function getAdminUserFromSessionToken(token: string | undefined | null) {
  if (!token) return null;
  await connectToDatabase();
  await AdminSessionModel.deleteMany({ expiresAt: { $lt: new Date() } });
  const session = await AdminSessionModel.findOne({ tokenHash: hashText(token) });
  if (!session || session.expiresAt.getTime() < Date.now()) return null;
  return AdminUserModel.findById(session.userId);
}

export async function getAdminUserFromCookies() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return getAdminUserFromSessionToken(token);
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export async function createResetCode(email: string) {
  await ensureAdminUserSeeded();
  const normalizedEmail = email.trim().toLowerCase();
  const user = await AdminUserModel.findOne({ email: normalizedEmail });
  if (!user) return null;
  const code = String(Math.floor(100000 + Math.random() * 900000));
  user.resetCodeHash = hashText(code);
  user.resetCodeExpiresAt = new Date(Date.now() + RESET_CODE_DURATION_MS);
  await user.save();
  return { email: normalizedEmail, code };
}

export async function createResetCodeForConfiguredAdmin() {
  return createResetCode(getConfiguredAdminEmail());
}

export async function resetPasswordWithCode(email: string, code: string, newPassword: string) {
  await connectToDatabase();
  const normalizedEmail = email.trim().toLowerCase();
  const user = await AdminUserModel.findOne({ email: normalizedEmail });
  if (!user || !user.resetCodeHash || !user.resetCodeExpiresAt) return false;
  if (user.resetCodeExpiresAt.getTime() < Date.now()) return false;
  const submittedHash = hashText(code.trim());
  if (!crypto.timingSafeEqual(Buffer.from(user.resetCodeHash), Buffer.from(submittedHash))) {
    return false;
  }
  user.passwordHash = hashPassword(newPassword);
  user.resetCodeHash = undefined;
  user.resetCodeExpiresAt = undefined;
  await user.save();
  await AdminSessionModel.deleteMany({ userId: new Types.ObjectId(String(user._id)) });
  return true;
}

export async function resetConfiguredAdminPasswordWithCode(code: string, newPassword: string) {
  return resetPasswordWithCode(getConfiguredAdminEmail(), code, newPassword);
}
