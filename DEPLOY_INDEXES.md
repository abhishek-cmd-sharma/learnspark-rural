# Deploy Firestore Indexes

The Firestore indexes need to be deployed to fix the "query requires an index" errors.

## Prerequisites

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Authenticate with Firebase:
   ```bash
   firebase login
   ```

## Deploy Indexes

Run the following command to deploy the Firestore indexes:

```bash
npm run deploy-indexes
```

Or run directly:

```bash
firebase deploy --only firestore:indexes
```

## Manual Index Creation

If you prefer to create indexes manually, click the links provided in the browser console error messages. These will take you directly to the Firebase console where you can create the required indexes.

The required indexes are:
- `userQuizAttempts` collection: `userId` (ASC) + `completedAt` (DESC)
- `userAchievements` collection: `userId` (ASC) + `unlockedAt` (DESC)
- `quizzes` collection: `subjectId` (ASC) + `createdAt` (ASC)

## Verification

After deploying the indexes, the Firestore query errors should be resolved and your application should work properly.
