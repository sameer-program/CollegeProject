# 🔑 All Login Credentials - DKN Platform

## ✅ Database Successfully Initialized!

The database has been populated with all initial data:
- ✅ **1 Platform** configuration
- ✅ **6 Users** (one for each role)
- ✅ **3 AI Modules**
- ✅ **6 Knowledge Resources** (various states)
- ✅ **30 Keywords** (linked to resources)
- ✅ **3 AI Analyses**

---

## 🔐 Login Credentials

**All users use the same password:** `password123`

### 1. 👨‍💼 Consultant
- **Email:** `consultant@dkn.com`
- **Password:** `password123`
- **User ID:** CONS-001
- **Name:** John Consultant
- **Division:** Engineering
- **Specialization:** Software Architecture
- **Project:** Project Alpha
- **Dashboard:** http://localhost:3000/dashboard/consultant
- **Can:** Create knowledge resources, view own resources, edit own resources

---

### 2. ✅ Validator
- **Email:** `validator@dkn.com`
- **Password:** `password123`
- **User ID:** VAL-001
- **Name:** Sarah Validator
- **Division:** Quality Assurance
- **Approved Submissions:** 0
- **Dashboard:** http://localhost:3000/dashboard/validator
- **Can:** Approve/reject pending knowledge resources, view all resources

---

### 3. 🏛️ Governance
- **Email:** `governance@dkn.com`
- **Password:** `password123`
- **User ID:** GOV-001
- **Name:** Michael Governance
- **Division:** Compliance
- **Compliance Score:** 95
- **Inspection Interval:** Monthly
- **Dashboard:** http://localhost:3000/dashboard/governance
- **Can:** Authorize approved resources, view compliance metrics

---

### 4. 📊 Executive
- **Email:** `executive@dkn.com`
- **Password:** `password123`
- **User ID:** EXEC-001
- **Name:** Emily Executive
- **Division:** Management
- **Privilege Level:** High
- **Dashboard:** http://localhost:3000/dashboard/executive
- **Can:** View analytics, platform metrics, charts, and statistics

---

### 5. 🎮 Controller (Admin)
- **Email:** `controller@dkn.com`
- **Password:** `password123`
- **User ID:** CTRL-001
- **Name:** David Controller
- **Division:** Operations
- **Control Tier:** 3
- **Access Rights:** read, write, approve
- **Dashboard:** http://localhost:3000/dashboard/controller
- **Can:** **EVERYTHING** - Full system administration, manage users, manage all resources, configure AI modules

---

### 6. 👤 Staff
- **Email:** `staff@dkn.com`
- **Password:** `password123`
- **User ID:** STAFF-001
- **Name:** Lisa Staff
- **Division:** General
- **Training Phase:** Intermediate
- **Dashboard:** http://localhost:3000/dashboard/staff
- **Can:** View authorized knowledge resources only

---

## 📊 Initial Data Summary

### Knowledge Resources Created:
1. **RES-001** - "Introduction to Software Architecture" (Approved)
2. **RES-002** - "Quality Assurance Best Practices" (Authorized) ⭐
3. **RES-003** - "Compliance and Regulatory Standards" (Approved)
4. **RES-004** - "Project Management Framework" (Pending) ⏳
5. **RES-005** - "System Operations Manual" (Approved)
6. **RES-006** - "Employee Onboarding Guide" (Approved)

### AI Modules Created:
1. **AI-MODULE-001** - Natural Language Processing (Performance: 92.5%)
2. **AI-MODULE-002** - Knowledge Extraction (Performance: 88.3%)
3. **AI-MODULE-003** - Content Classification (Performance: 90.1%)

### Platform Configuration:
- **Platform ID:** PLATFORM-1
- **Version:** 1.0.0
- **Registered Users:** 6
- **Stored Knowledge:** 6
- **Operational Time:** Calculated from creation

---

## 🚀 Quick Start

1. **Start the server** (if not running):
   ```bash
   npm run dev
   ```

2. **Open browser:**
   - Go to: http://localhost:3000

3. **Login:**
   - Click "Login" or go to: http://localhost:3000/login
   - Use any of the credentials above

4. **Test the workflow:**
   - Login as **Consultant** → Create a knowledge resource
   - Login as **Validator** → Approve the pending resource
   - Login as **Governance** → Authorize the approved resource
   - Login as **Staff** → View the authorized resource

---

## 🎯 Testing Workflow

### Complete Approval Flow:
1. **Consultant** (`consultant@dkn.com`) creates a resource → **Pending**
2. **Validator** (`validator@dkn.com`) approves it → **Approved**
3. **Governance** (`governance@dkn.com`) authorizes it → **Authorized**
4. **Staff** (`staff@dkn.com`) can now view it

### Admin Access:
- **Controller** (`controller@dkn.com`) can do everything and manage all users/resources

### Analytics:
- **Executive** (`executive@dkn.com`) can view charts and platform statistics

---

## 📝 Notes

- All passwords are: `password123`
- Passwords are hashed using bcrypt in the database
- Each user has role-specific fields populated
- Knowledge resources are in different approval states for testing
- Keywords are linked to resources for search functionality
- AI analyses are available for some resources

---

## 🔄 Re-initialize Database

If you need to reset the database and start fresh:

```bash
npm run init-db
```

This will:
- Clear all existing data
- Recreate all users, resources, and configurations
- Reset all counters and metrics

---

**Happy Testing! 🎉**

