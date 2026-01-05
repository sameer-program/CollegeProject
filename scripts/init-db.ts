import mongoose from "mongoose";
import connectDB from "../lib/db/connect";
import User from "../lib/db/models/User";
import DKNPlatform from "../lib/db/models/DKNPlatform";
import KnowledgeResource from "../lib/db/models/KnowledgeResource";
import AIModule from "../lib/db/models/AIModule";
import AIKnowledgeAnalysis from "../lib/db/models/AIKnowledgeAnalysis";
import KnowledgeKeyword from "../lib/db/models/KnowledgeKeyword";

const MONGODB_URI =
  "mongodb+srv://raisamir4494_db_user:cefkQPOZRbzEYOHh@cluster0.niibu41.mongodb.net/CollegeProject";

async function initializeDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    console.log("⚠️  Note: Make sure your IP is whitelisted in MongoDB Atlas");
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("✅ Connected to MongoDB");

    // Clear ALL existing data
    console.log("🧹 Cleaning ALL existing data...");
    console.log("   - Deleting users...");
    await User.deleteMany({});
    console.log("   - Deleting platforms...");
    await DKNPlatform.deleteMany({});
    console.log("   - Deleting knowledge resources...");
    await KnowledgeResource.deleteMany({});
    console.log("   - Deleting AI modules...");
    await AIModule.deleteMany({});
    console.log("   - Deleting AI analyses...");
    await AIKnowledgeAnalysis.deleteMany({});
    console.log("   - Deleting keywords...");
    await KnowledgeKeyword.deleteMany({});
    console.log("✅ All data cleaned");

    // Create Platform
    console.log("📦 Creating platform...");
    const platform = await DKNPlatform.create({
      platform_id: "PLATFORM-1",
      release_version: "1.0.0",
      operational_time: 0,
      registered_users: 0,
      stored_knowledge_count: 0,
    });
    console.log("✅ Platform created");

    // Create Users for each role (using create to trigger password hashing)
    console.log("👥 Creating users...");
    const user1 = await User.create({
      unique_user_id: "CONS-001",
      full_name: "John Consultant",
      email: "consultant@dkn.com",
      password: "password123",
      division: "Engineering",
      role: "consultant",
      specialisation_field: "Software Architecture",
      assigned_project: "Project Alpha",
    });

    const user2 = await User.create({
      unique_user_id: "VAL-001",
      full_name: "Sarah Validator",
      email: "validator@dkn.com",
      password: "password123",
      division: "Quality Assurance",
      role: "validator",
      approved_submissions: 0,
    });

    const user3 = await User.create({
      unique_user_id: "GOV-001",
      full_name: "Michael Governance",
      email: "governance@dkn.com",
      password: "password123",
      division: "Compliance",
      role: "governance",
      compliance_score: 95,
      inspection_interval: "Monthly",
    });

    const user4 = await User.create({
      unique_user_id: "EXEC-001",
      full_name: "Emily Executive",
      email: "executive@dkn.com",
      password: "password123",
      division: "Management",
      role: "executive",
      privilege_level: "High",
    });

    const user5 = await User.create({
      unique_user_id: "CTRL-001",
      full_name: "David Controller",
      email: "controller@dkn.com",
      password: "password123",
      division: "Operations",
      role: "controller",
      control_tier: 3,
      access_rights: ["read", "write", "approve"],
    });

    const user6 = await User.create({
      unique_user_id: "STAFF-001",
      full_name: "Lisa Staff",
      email: "staff@dkn.com",
      password: "password123",
      division: "General",
      role: "staff",
      training_phase: "Intermediate",
    });

    const users = [user1, user2, user3, user4, user5, user6];
    console.log("✅ Users created");

    // Create AI Modules
    console.log("🤖 Creating AI modules...");
    const aiModules = await AIModule.insertMany([
      {
        module_id: "AI-MODULE-001",
        algorithm_type: "Natural Language Processing",
        performance_index: 92.5,
        model_updated_on: new Date(),
        platform_id: platform._id,
      },
      {
        module_id: "AI-MODULE-002",
        algorithm_type: "Knowledge Extraction",
        performance_index: 88.3,
        model_updated_on: new Date(),
        platform_id: platform._id,
      },
      {
        module_id: "AI-MODULE-003",
        algorithm_type: "Content Classification",
        performance_index: 90.1,
        model_updated_on: new Date(),
        platform_id: platform._id,
      },
    ]);
    console.log("✅ AI modules created");

    // Create Knowledge Resources
    console.log("📚 Creating knowledge resources...");
    const knowledgeResources = await KnowledgeResource.insertMany([
      {
        resource_id: "RES-001",
        heading: "Introduction to Software Architecture",
        data_body:
          "Software architecture is the fundamental organization of a system, embodied in its components, their relationships to each other and the environment, and the principles governing its design and evolution. This knowledge resource covers the basics of architectural patterns, design principles, and best practices.",
        approval_state: "Approved",
        classification: "Technical",
        revision_number: 1,
        user_rating: 4.5,
        access_count: 150,
        created_by: users[0]._id, // consultant
      },
      {
        resource_id: "RES-002",
        heading: "Quality Assurance Best Practices",
        data_body:
          "Quality assurance is a systematic process of ensuring that products and services meet specified requirements. This resource outlines testing methodologies, quality metrics, and validation procedures used in modern software development.",
        approval_state: "Authorized",
        classification: "Process",
        revision_number: 2,
        user_rating: 4.8,
        access_count: 200,
        created_by: users[1]._id, // validator
      },
      {
        resource_id: "RES-003",
        heading: "Compliance and Regulatory Standards",
        data_body:
          "This document outlines the compliance requirements and regulatory standards that must be followed in our organization. It includes information about data protection, security protocols, and audit procedures.",
        approval_state: "Approved",
        classification: "Compliance",
        revision_number: 1,
        user_rating: 4.2,
        access_count: 180,
        created_by: users[2]._id, // governance
      },
      {
        resource_id: "RES-004",
        heading: "Project Management Framework",
        data_body:
          "A comprehensive guide to project management methodologies, including Agile, Scrum, and Waterfall approaches. This resource provides templates, tools, and best practices for effective project delivery.",
        approval_state: "Pending",
        classification: "Management",
        revision_number: 0,
        user_rating: 0,
        access_count: 25,
        created_by: users[3]._id, // executive
      },
      {
        resource_id: "RES-005",
        heading: "System Operations Manual",
        data_body:
          "Detailed operational procedures for system maintenance, monitoring, and troubleshooting. Includes escalation procedures, backup protocols, and disaster recovery plans.",
        approval_state: "Approved",
        classification: "Operations",
        revision_number: 3,
        user_rating: 4.6,
        access_count: 120,
        created_by: users[4]._id, // controller
      },
      {
        resource_id: "RES-006",
        heading: "Employee Onboarding Guide",
        data_body:
          "A comprehensive guide for new employees covering company policies, procedures, tools, and resources. This document helps new staff members get up to speed quickly.",
        approval_state: "Approved",
        classification: "HR",
        revision_number: 1,
        user_rating: 4.3,
        access_count: 95,
        created_by: users[5]._id, // staff
      },
    ]);
    console.log("✅ Knowledge resources created");

    // Create Knowledge Keywords
    console.log("🏷️  Creating knowledge keywords...");
    const keywords = [];
    const keywordMappings = [
      {
        resource: 0,
        keywords: [
          "software",
          "architecture",
          "design",
          "patterns",
          "principles",
        ],
      },
      {
        resource: 1,
        keywords: ["quality", "assurance", "testing", "validation", "metrics"],
      },
      {
        resource: 2,
        keywords: [
          "compliance",
          "regulatory",
          "standards",
          "audit",
          "security",
        ],
      },
      {
        resource: 3,
        keywords: ["project", "management", "agile", "scrum", "methodology"],
      },
      {
        resource: 4,
        keywords: [
          "operations",
          "maintenance",
          "monitoring",
          "troubleshooting",
          "backup",
        ],
      },
      {
        resource: 5,
        keywords: [
          "onboarding",
          "employee",
          "training",
          "policies",
          "procedures",
        ],
      },
    ];

    for (const mapping of keywordMappings) {
      for (const keyword of mapping.keywords) {
        keywords.push({
          knowledge_resource_id: knowledgeResources[mapping.resource]._id,
          keyword: keyword,
        });
      }
    }
    await KnowledgeKeyword.insertMany(keywords);
    console.log("✅ Knowledge keywords created");

    // Create AI Knowledge Analysis
    console.log("🔍 Creating AI knowledge analysis...");
    await AIKnowledgeAnalysis.insertMany([
      {
        ai_module_id: aiModules[0]._id,
        knowledge_resource_id: knowledgeResources[0]._id,
        analysis_score: 92,
        recommendations: [
          "Add more examples",
          "Include code snippets",
          "Update with latest patterns",
        ],
        tags: ["architecture", "design", "patterns"],
        popularity_score: 85,
      },
      {
        ai_module_id: aiModules[1]._id,
        knowledge_resource_id: knowledgeResources[1]._id,
        analysis_score: 88,
        recommendations: [
          "Expand testing scenarios",
          "Add automation examples",
        ],
        tags: ["qa", "testing", "validation"],
        popularity_score: 90,
      },
      {
        ai_module_id: aiModules[2]._id,
        knowledge_resource_id: knowledgeResources[2]._id,
        analysis_score: 95,
        recommendations: ["Keep updated with latest regulations"],
        tags: ["compliance", "regulatory"],
        popularity_score: 88,
      },
    ]);
    console.log("✅ AI knowledge analysis created");

    // Update Platform Metrics
    console.log("📊 Updating platform metrics...");
    platform.registered_users = users.length;
    platform.stored_knowledge_count = knowledgeResources.length;
    platform.operational_time = Math.floor(
      (Date.now() - platform.createdAt.getTime()) / 1000
    );
    await platform.save();
    console.log("✅ Platform metrics updated");

    console.log("\n✅ Database initialization completed successfully!");
    console.log("\n📋 Summary:");
    console.log(`   - Platform: 1`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - AI Modules: ${aiModules.length}`);
    console.log(`   - Knowledge Resources: ${knowledgeResources.length}`);
    console.log(`   - Keywords: ${keywords.length}`);
    console.log(`   - AI Analyses: 3`);

    console.log("\n🔑 Login Credentials:");
    console.log("   Consultant: consultant@dkn.com / password123");
    console.log("   Validator: validator@dkn.com / password123");
    console.log("   Governance: governance@dkn.com / password123");
    console.log("   Executive: executive@dkn.com / password123");
    console.log("   Controller: controller@dkn.com / password123");
    console.log("   Staff: staff@dkn.com / password123");

    await mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

initializeDatabase();
