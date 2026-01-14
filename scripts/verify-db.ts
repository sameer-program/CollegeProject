import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://raisamir4494_db_user:cefkQPOZRbzEYOHh@cluster0.niibu41.mongodb.net/CollegeProject";

async function verifyDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    if (!mongoose.connection.db) {
      throw new Error("Database connection not ready");
    }

    console.log("✅ Connected to MongoDB");
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}\n`);

    // Get all collections
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    console.log("📁 Collections found:");
    collections.forEach((col) => {
      console.log(`   - ${col.name}`);
    });
    console.log();

    const db = mongoose.connection.db;

    // Count documents in each collection (check existence first)
    const safeCount = async (name: string) => {
      const exists = collections.some((c) => c.name === name);
      return exists ? db.collection(name).countDocuments() : 0;
    };

    const userCount = await safeCount("users");
    const platformCount = await safeCount("dknplatforms");
    const knowledgeCount = await safeCount("knowledgeresources");
    const keywordCount = await safeCount("knowledgekeywords");
    const aiModuleCount = await safeCount("aimodules");
    const aiAnalysisCount = await safeCount("aiknowledgeanalyses");

    console.log("📊 Document Counts:");
    console.log(`   - users: ${userCount}`);
    console.log(`   - dknplatforms: ${platformCount}`);
    console.log(`   - knowledgeresources: ${knowledgeCount}`);
    console.log(`   - knowledgekeywords: ${keywordCount}`);
    console.log(`   - aimodules: ${aiModuleCount}`);
    console.log(`   - aiknowledgeanalyses: ${aiAnalysisCount}`);
    console.log();

    // Show sample users
    if (userCount > 0) {
      console.log("👥 Sample Users:");
      const users = await db.collection("users").find({}).limit(3).toArray();
      users.forEach((user: any) => {
        console.log(`   - ${user.email} (${user.role}) - ID: ${user.unique_user_id}`);
      });
    }

    // Show sample knowledge resources
    if (knowledgeCount > 0) {
      console.log("\n📚 Sample Knowledge Resources:");
      const resources = await db
        .collection("knowledgeresources")
        .find({})
        .limit(3)
        .toArray();
      resources.forEach((res: any) => {
        console.log(`   - ${res.heading} (${res.approval_state}) - ID: ${res.resource_id}`);
      });
    }

    await mongoose.connection.close();
    console.log("\n✅ Verification complete");
  } catch (error: any) {
    console.error("❌ Error verifying database:", error.message);

    if (error.message.includes("IP")) {
      console.error("\n⚠️  Make sure your IP is whitelisted in MongoDB Atlas!");
      console.error("   Go to: MongoDB Atlas → Network Access → Add IP Address");
    }

    await mongoose.connection.close();
    process.exit(1);
  }
}

verifyDatabase();
