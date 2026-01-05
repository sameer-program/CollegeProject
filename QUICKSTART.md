# Quick Start Guide

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
MONGODB_URI=mongodb+srv://raisamir4494_db_user:cefkQPOZRbzEYOHh@cluster0.niibu41.mongodb.net/CollegeProject
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-in-production
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

**Important**: Change the `NEXTAUTH_SECRET` and `JWT_SECRET` to secure random strings in production.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## First Steps

### 1. Register a User

1. Navigate to `http://localhost:3000/register`
2. Fill in the registration form
3. Choose a role (start with `consultant` or `validator` for testing)
4. Submit the form

### 2. Login

1. Navigate to `http://localhost:3000/login`
2. Enter your email and password
3. You'll be redirected to your role-specific dashboard

### 3. Create Knowledge (Consultant)

1. Login as a Consultant
2. Click "Create Knowledge" or navigate to `/knowledge/create`
3. Fill in:
   - Heading: "Getting Started with DKN"
   - Classification: "Documentation"
   - Content: "This is a sample knowledge resource..."
   - Keywords: "getting-started, documentation, guide"
4. Submit

### 4. Approve Knowledge (Validator)

1. Login as a Validator
2. Go to Validator Dashboard
3. You'll see pending knowledge resources
4. Click "Approve" or "Reject"

### 5. Authorize Knowledge (Governance)

1. Login as Governance
2. Go to Governance Dashboard
3. You'll see approved resources
4. Click "Authorize" to finalize

## Testing Different Roles

To test all features, create users with different roles:

1. **Consultant** - Create knowledge resources
2. **Validator** - Approve/reject resources
3. **Governance** - Authorize approved resources
4. **Executive** - View analytics and charts
5. **Controller** - Full system access
6. **Staff** - View authorized resources

## Common Issues

### MongoDB Connection Error

- Verify your MongoDB connection string in `.env.local`
- Ensure the database name is `CollegeProject`
- Check if your MongoDB Atlas IP whitelist includes your current IP

### Authentication Issues

- Clear browser cookies
- Verify `NEXTAUTH_SECRET` is set
- Check that `NEXTAUTH_URL` matches your current URL

### Build Errors

- Delete `node_modules` and `.next` folders
- Run `npm install` again
- Run `npm run build` to check for errors

## Next Steps

- Explore the different dashboards
- Create multiple knowledge resources
- Test the approval workflow
- View analytics in the Executive dashboard
- Check AI analysis features

## Support

Refer to the main README.md for detailed documentation.

