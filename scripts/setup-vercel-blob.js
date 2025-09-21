#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🚀 Setting up Vercel Blob Storage...\n");

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local");
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log("📝 Creating .env.local file...");
  fs.writeFileSync(envPath, "# Environment Variables\n");
}

// Read current .env.local
let envContent = fs.readFileSync(envPath, "utf8");

// Check if BLOB_READ_WRITE_TOKEN already exists
if (envContent.includes("BLOB_READ_WRITE_TOKEN")) {
  console.log("✅ BLOB_READ_WRITE_TOKEN already exists in .env.local");
} else {
  console.log("📝 Adding BLOB_READ_WRITE_TOKEN to .env.local...");
  envContent +=
    "\n# Vercel Blob Storage\nBLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here\n";
  fs.writeFileSync(envPath, envContent);
  console.log("✅ Added BLOB_READ_WRITE_TOKEN placeholder to .env.local");
}

console.log("\n📋 Next steps:");
console.log("1. Go to https://vercel.com/dashboard");
console.log("2. Select your project");
console.log("3. Go to Storage tab");
console.log("4. Create a new Blob store");
console.log(
  '5. Copy the token and replace "your_vercel_blob_token_here" in .env.local'
);
console.log("6. Run: npm run dev (for development) or deploy to production");
console.log(
  "\n💡 Alternative: Use the fallback storage by not setting the token"
);
console.log("   (Files will be stored in public/uploads/avatars/)");
