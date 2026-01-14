# Screenshot Guide for Coursework 2 Report

This guide lists all the screenshots you need to take and where to place them in your report.

## Required Screenshots

### Type Model Screenshots (Figures 1-9)

1. **Figure 1: User Model TypeScript Interface**

   - Screenshot: `lib/db/models/User.ts` showing the interface definition
   - Location: VS Code or your IDE showing the IUser interface

2. **Figure 2: User Model Mongoose Schema**

   - Screenshot: `lib/db/models/User.ts` showing the schema definition
   - Location: VS Code showing the userSchema

3. **Figure 3: KnowledgeResource Model Interface**

   - Screenshot: `lib/db/models/KnowledgeResource.ts` showing IKnowledgeResource interface

4. **Figure 4: KnowledgeResource Model Schema**

   - Screenshot: `lib/db/models/KnowledgeResource.ts` showing the schema

5. **Figure 5: KnowledgeKeyword Model with Compound Index**

   - Screenshot: `lib/db/models/KnowledgeKeyword.ts` showing the schema and index

6. **Figure 6: DKNPlatform Model Schema**

   - Screenshot: `lib/db/models/DKNPlatform.ts` showing the schema

7. **Figure 7: AIModule Model Schema**

   - Screenshot: `lib/db/models/AIModule.ts` showing the schema

8. **Figure 8: AIKnowledgeAnalysis Model with Compound Index**

   - Screenshot: `lib/db/models/AIKnowledgeAnalysis.ts` showing schema and index

9. **Figure 9: Model Relationships Summary Table**
   - Screenshot: The table from the report (or create a visual diagram)

### UI and API Screenshots (Figures 10-24)

10. **Figure 10: System Architecture Diagram**

    - Create a diagram showing Client → Server → Database flow
    - Use draw.io, Lucidchart, or similar tool

11. **Figure 11: Authentication API Endpoints**

    - Screenshot: Code from `app/api/auth/register/route.ts` or `app/api/auth/[...nextauth]/route.ts`

12. **Figure 12: Knowledge Resource API Endpoints**

    - Screenshot: Code from `app/api/knowledge/route.ts`

13. **Figure 13: User Management API Endpoints**

    - Screenshot: Code from `app/api/users/route.ts`

14. **Figure 14: Platform & AI API Endpoints**

    - Screenshot: Code from `app/api/platform/stats/route.ts` or `app/api/ai/modules/route.ts`

15. **Figure 15: User Management Component - API Integration**

    - Screenshot: Code from `app/(dashboard)/dashboard/controller/users/page.tsx` showing fetchUsers function

16. **Figure 16: User Management Interface Screenshot**

    - Screenshot: Browser showing the user management page running
    - URL: `http://localhost:3000/dashboard/controller/users`
    - Show the table with users and "Create User" button

17. **Figure 17: Knowledge Resource List - API Integration**

    - Screenshot: Code from `app/knowledge/page.tsx` showing fetchResources function

18. **Figure 18: Knowledge Resource List Interface Screenshot**

    - Screenshot: Browser showing the knowledge list page
    - URL: `http://localhost:3000/knowledge`
    - Show filters and resource cards

19. **Figure 19: Knowledge Creation - API Integration**

    - Screenshot: Code from `app/knowledge/create/page.tsx` showing handleSubmit function

20. **Figure 20: Knowledge Creation Interface Screenshot**

    - Screenshot: Browser showing the create knowledge form
    - URL: `http://localhost:3000/knowledge/create`

21. **Figure 21: Validator Dashboard - Approval Action**

    - Screenshot: Code from `app/(dashboard)/dashboard/validator/page.tsx` showing handleApprove function

22. **Figure 22: Validator Dashboard Interface Screenshot**

    - Screenshot: Browser showing validator dashboard
    - URL: `http://localhost:3000/dashboard/validator`
    - Show pending resources with approve/reject buttons

23. **Figure 23: API Connectivity Pattern Flowchart**

    - Create a flowchart showing: Component Mount → useEffect → Fetch API → Update State → Re-render

24. **Figure 24: Authentication Integration Code**
    - Screenshot: Code from `components/providers/AuthProvider.tsx` and usage example

### Non-Functional Requirements Screenshots (Figures 25-29)

25. **Figure 25: Performance Metrics Dashboard**

    - Screenshot: Browser DevTools Network tab showing response times
    - Or: Executive dashboard showing performance metrics

26. **Figure 26: Scalability Architecture Diagram**

    - Create a diagram showing horizontal scaling, load balancing, etc.

27. **Figure 27: Authentication Flow Diagram**

    - Create a flowchart: Login → Validate → Generate JWT → Store Session → Access Protected Routes

28. **Figure 28: Role-Based Access Control Matrix**

    - Create a table showing roles and their permissions

29. **Figure 29: Security Validation Flow**
    - Create a diagram showing input validation process

### Deployment Screenshots (Figures 30-37)

30. **Figure 30: Vercel Deployment Dashboard**

    - Screenshot: Vercel dashboard showing your project
    - URL: https://vercel.com/dashboard

31. **Figure 31: Back End Server Configuration**

    - Screenshot: Vercel project settings showing build configuration
    - Or: Environment variables (hide sensitive values)

32. **Figure 32: Front End Deployment Server Info**

    - Screenshot: Vercel deployment page showing deployment status
    - Show: Build logs, deployment URL, status

33. **Figure 33: Vercel Deployment Status**

    - Screenshot: Vercel showing successful deployment
    - Show: Green checkmark, deployment time, commit hash

34. **Figure 34: Dockerfile Configuration**

    - Screenshot: Dockerfile code (if using Docker)
    - Or: Skip if not using Docker

35. **Figure 35: Traditional Server Deployment Architecture**

    - Create a diagram (if applicable)
    - Or: Skip if using Vercel

36. **Figure 36: MongoDB Atlas Dashboard**

    - Screenshot: MongoDB Atlas dashboard
    - URL: https://cloud.mongodb.com
    - Show: Cluster overview, database name

37. **Figure 37: Database Initialization Script**
    - Screenshot: Terminal/command prompt running `npm run init-db`
    - Show: Script execution and success message

### Postman API Testing Screenshots (Figures 38-42)

38. **Figure 38: Postman - GET /api/users Request**

    - Screenshot: Postman showing GET request to `/api/users`
    - Show: Request URL, headers, response (200 OK)
    - Include: Response body with user list

39. **Figure 39: Postman - POST /api/knowledge Request**

    - Screenshot: Postman showing POST request to `/api/knowledge`
    - Show: Request body (JSON), headers, response (201 Created)

40. **Figure 40: Postman - GET /api/knowledge Response**

    - Screenshot: Postman showing GET `/api/knowledge` response
    - Show: Response body with resources array, pagination object

41. **Figure 41: Postman - POST /api/knowledge/[id]/approve Request**

    - Screenshot: Postman showing POST to approve endpoint
    - Show: Request with resource ID, response showing updated state

42. **Figure 42: Postman - GET /api/platform/stats Response**
    - Screenshot: Postman showing platform stats response
    - Show: Response with user count, knowledge count, operational time

### Dependency Screenshots (Figures 43-44)

43. **Figure 43: package.json - Dependencies List**

    - Screenshot: VS Code showing `package.json` file
    - Show: Both dependencies and devDependencies sections

44. **Figure 44: Complete Dependency List**
    - Screenshot: Terminal showing `npm list` output
    - Or: Another view of package.json

### Source Code Screenshots (Figures 45-60)

45. **Figure 45: User Model Complete Code**

    - Screenshot: Full `lib/db/models/User.ts` file in VS Code

46. **Figure 46: KnowledgeResource Model Complete Code**

    - Screenshot: Full `lib/db/models/KnowledgeResource.ts` file

47. **Figure 47: KnowledgeKeyword Model Complete Code**

    - Screenshot: Full `lib/db/models/KnowledgeKeyword.ts` file

48. **Figure 48: DKNPlatform Model Complete Code**

    - Screenshot: Full `lib/db/models/DKNPlatform.ts` file

49. **Figure 49: AIModule Model Complete Code**

    - Screenshot: Full `lib/db/models/AIModule.ts` file

50. **Figure 50: AIKnowledgeAnalysis Model Complete Code**

    - Screenshot: Full `lib/db/models/AIKnowledgeAnalysis.ts` file

51. **Figure 51: Users API Route**

    - Screenshot: Full `app/api/users/route.ts` file

52. **Figure 52: Knowledge API Route**

    - Screenshot: Full `app/api/knowledge/route.ts` file

53. **Figure 53: Knowledge by ID API Route**

    - Screenshot: Full `app/api/knowledge/[id]/route.ts` file

54. **Figure 54: Platform Stats API Route**

    - Screenshot: Full `app/api/platform/stats/route.ts` file

55. **Figure 55: AI Modules API Route**

    - Screenshot: Full `app/api/ai/modules/route.ts` file

56. **Figure 56: User Management Page**

    - Screenshot: Full `app/(dashboard)/dashboard/controller/users/page.tsx` file

57. **Figure 57: Knowledge List Page**

    - Screenshot: Full `app/knowledge/page.tsx` file

58. **Figure 58: Knowledge Creation Page**

    - Screenshot: Full `app/knowledge/create/page.tsx` file

59. **Figure 59: Validator Dashboard**

    - Screenshot: Full `app/(dashboard)/dashboard/validator/page.tsx` file

60. **Figure 60: Consultant Dashboard**
    - Screenshot: Full `app/(dashboard)/dashboard/consultant/page.tsx` file

### Application Running Screenshots (Figures 61-72)

61. **Figure 61: Application Home Page**

    - Screenshot: Browser showing `http://localhost:3000`
    - Show: Home page or redirect to login

62. **Figure 62: Login Page**

    - Screenshot: Browser showing login form
    - URL: `http://localhost:3000/login`

63. **Figure 63: User Registration Page**

    - Screenshot: Browser showing registration form
    - URL: `http://localhost:3000/register`

64. **Figure 64: Controller Dashboard - User Management**

    - Screenshot: Browser showing user management interface
    - URL: `http://localhost:3000/dashboard/controller/users`
    - Show: User table, create button, role badges

65. **Figure 65: Consultant Dashboard - Knowledge Creation**

    - Screenshot: Browser showing consultant dashboard
    - URL: `http://localhost:3000/dashboard/consultant`
    - Show: Create knowledge form or button

66. **Figure 66: Validator Dashboard - Pending Resources**

    - Screenshot: Browser showing validator dashboard
    - URL: `http://localhost:3000/dashboard/validator`
    - Show: Pending resources list with approve/reject buttons

67. **Figure 67: Governance Dashboard - Authorization**

    - Screenshot: Browser showing governance dashboard
    - URL: `http://localhost:3000/dashboard/governance`
    - Show: Approved resources with authorize button

68. **Figure 68: Executive Dashboard - Analytics**

    - Screenshot: Browser showing executive dashboard
    - URL: `http://localhost:3000/dashboard/executive`
    - Show: Charts, statistics, metrics

69. **Figure 69: Staff Dashboard - Authorized Resources**

    - Screenshot: Browser showing staff dashboard
    - URL: `http://localhost:3000/dashboard/staff`
    - Show: Authorized resources list

70. **Figure 70: Knowledge Resource Detail Page**

    - Screenshot: Browser showing knowledge resource details
    - URL: `http://localhost:3000/knowledge/[id]`
    - Show: Full resource content, keywords, metadata

71. **Figure 71: Knowledge Resource Edit Page**

    - Screenshot: Browser showing edit form
    - URL: `http://localhost:3000/knowledge/[id]/edit`
    - Show: Edit form with pre-filled data

72. **Figure 72: Platform Statistics Display**
    - Screenshot: Browser showing platform stats
    - URL: Executive dashboard or stats page
    - Show: User count, knowledge count, operational time

### Database Screenshots (Figures 73-79)

73. **Figure 73: MongoDB Atlas - Database Collections**

    - Screenshot: MongoDB Atlas showing all collections
    - Show: Collections list (users, knowledgeresources, etc.)

74. **Figure 74: MongoDB Atlas - Users Collection**

    - Screenshot: MongoDB Atlas showing users collection
    - Show: Sample documents, field structure

75. **Figure 75: MongoDB Atlas - KnowledgeResources Collection**

    - Screenshot: MongoDB Atlas showing knowledgeresources collection
    - Show: Sample documents

76. **Figure 76: MongoDB Atlas - KnowledgeKeywords Collection**

    - Screenshot: MongoDB Atlas showing knowledgekeywords collection

77. **Figure 77: MongoDB Atlas - DKNPlatforms Collection**

    - Screenshot: MongoDB Atlas showing dknplatforms collection

78. **Figure 78: MongoDB Atlas - AIModules Collection**

    - Screenshot: MongoDB Atlas showing aimodules collection

79. **Figure 79: MongoDB Atlas - AIKnowledgeAnalyses Collection**
    - Screenshot: MongoDB Atlas showing aiknowledgeanalyses collection

### Deployment Screenshots (Figures 80-84)

80. **Figure 80: Vercel Deployment Dashboard**

    - Screenshot: Vercel dashboard showing project overview
    - Show: Project name, deployment status, recent deployments

81. **Figure 81: Vercel Build Logs**

    - Screenshot: Vercel showing build process
    - Show: Build steps, success message, build time

82. **Figure 82: Vercel Environment Variables Configuration**

    - Screenshot: Vercel environment variables page
    - **IMPORTANT:** Blur or hide actual secret values
    - Show: Variable names only

83. **Figure 83: Vercel Domain Configuration**

    - Screenshot: Vercel showing domain settings
    - Show: Assigned domain, custom domain options

84. **Figure 84: Application Running on Production URL**
    - Screenshot: Browser showing application on Vercel URL
    - URL: `https://your-project.vercel.app`
    - Show: Application running successfully

## Tips for Taking Screenshots

1. **Code Screenshots:**

   - Use VS Code with a clean theme
   - Ensure code is readable (zoom if needed)
   - Include line numbers
   - Show relevant function/class names

2. **Browser Screenshots:**

   - Use full-screen or windowed mode
   - Hide personal information
   - Show relevant UI elements clearly
   - Include URL bar if helpful

3. **Postman Screenshots:**

   - Show request and response clearly
   - Include status codes
   - Show JSON formatting
   - Include headers if relevant

4. **Terminal Screenshots:**

   - Use readable font size
   - Show command and output
   - Include success/error messages

5. **Database Screenshots:**
   - Show collection structure clearly
   - Include sample documents
   - Hide sensitive data if any

## Screenshot Organization

Organize your screenshots in a folder structure:

```
screenshots/
├── type-models/
│   ├── figure-1-user-interface.png
│   ├── figure-2-user-schema.png
│   └── ...
├── ui-components/
│   ├── figure-16-user-management.png
│   └── ...
├── api-testing/
│   ├── figure-38-postman-users.png
│   └── ...
├── deployment/
│   ├── figure-30-vercel-dashboard.png
│   └── ...
└── database/
    ├── figure-73-collections.png
    └── ...
```

## Adding Screenshots to Report

When adding screenshots to your PDF report:

1. Insert images at appropriate figure locations
2. Ensure images are high quality (at least 300 DPI for print)
3. Add captions below each figure
4. Reference figures in text using "Figure X" format
5. Ensure images are readable when printed

## Checklist

- [ ] All Type Model code screenshots (Figures 1-9)
- [ ] All UI component code screenshots (Figures 10-24)
- [ ] All application running screenshots (Figures 61-72)
- [ ] All Postman API testing screenshots (Figures 38-42)
- [ ] All database screenshots (Figures 73-79)
- [ ] All deployment screenshots (Figures 30-37, 80-84)
- [ ] Dependency list screenshot (Figure 43-44)
- [ ] All source code files (Figures 45-60)

Good luck with your coursework!

