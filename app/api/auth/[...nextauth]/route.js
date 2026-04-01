import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma"; // Connects to the DB (VM-4)

// This configuration fulfills "Note 1" of your MCIT project layout.
// It is designed to act as the authentication bridge between the Next.js app
// and the Windows Server 2022 Active Directory Domain Controller (VM-1).
const authOptions = {
 providers: [
 CredentialsProvider({
 name: "Active Directory",
 credentials: {
 username: { label: "Elmhurst ID (eNumber)", type: "text", placeholder: "e1234567" },
 password: { label: "Password", type: "password" }
 },
 async authorize(credentials) {
 if (!credentials?.username || !credentials?.password) {
 throw new Error("Missing username or password");
 }

 const username = credentials.username;
 const password = credentials.password;

 /* 
 // ==========================================
 // ACTIVE DIRECTORY INTEGRATION ZONE (VM-1)
 // ==========================================
 // In production, you would use a package like 'ldapjs' here to bind 
 // to your domain controller at AD_LDAP_URL (10.0.1.10).
 // 
 // Example LDAP bind process:
 // const client = ldap.createClient({ url: process.env.AD_LDAP_URL });
 // const bound = await client.bind(`JAYCONNECT\\${username}`, password);
 // if (!bound) throw new Error("Invalid AD Credentials");
 */

 // SIMULATED AD CHECK FOR NOW:
 // We will accept any login where the username is not empty.
 // Once verified by the AD server, we connect to the PostgreSQL DB (VM-4).
 const isValidLogon = true; // Swap with actual LDAP bind result 

 if (isValidLogon) {
 // 1. Check if this student already opened JayConnect before 
 let user = await prisma.user.findUnique({
 where: { adUsername: username }
 });

 // 2. If it is their first time logging in, create a record in our PostgreSQL DB
 if (!user) {
 user = await prisma.user.create({
 data: {
 adUsername: username,
 email: `${username}@elmhurst.edu`,
 fullName: `Jay ${username}`, // Typically you extract this from AD profile
 role: "student",
 }
 });
 }

 // Return user object so next-auth builds a secure session JWT
 return {
 id: user.id,
 name: user.fullName,
 email: user.email,
 role: user.role,
 };
 } else {
 return null; // Login failed
 }
 }
 })
 ],
 session: {
 strategy: "jwt", // Use JWT tokens instead of saving sessions to the DB
 maxAge: 30 * 24 * 60 * 60, // 30 days
 },
 callbacks: {
 async jwt({ token, user }) {
 if (user) {
 token.role = user.role;
 token.id = user.id;
 }
 return token;
 },
 async session({ session, token }) {
 if (session.user) {
 session.user.role = token.role;
 session.user.id = token.id;
 }
 return session;
 }
 },
 secret: process.env.NEXTAUTH_SECRET || "SUPER_SECRET_JAYCONNECT_KEY_123", // Keep this safe
};

const handler = NextAuth(authOptions);

// Next.js App Router exports
export { handler as GET, handler as POST };
