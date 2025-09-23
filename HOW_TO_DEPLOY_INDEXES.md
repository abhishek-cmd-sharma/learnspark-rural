# How to Deploy Firestore Indexes to Fix Query Errors

This guide explains how to deploy the Firestore indexes defined in `firestore.indexes.json` to resolve the "query requires an index" errors in your application.

## Understanding the Problem

The errors you're seeing in the console indicate that Firestore needs specific composite indexes to execute queries efficiently. These errors occur when you try to run queries with `where()` and `orderBy()` clauses on different fields.

The specific errors are:
1. `userQuizAttempts` collection query requires: `userId` (ASC) + `completedAt` (DESC)
2. `quizzes` collection query requires: `subjectId` (ASC) + `createdAt` (ASC)
3. `userAchievements` collection query requires: `userId` (ASC) + `unlockedAt` (DESC)

All these indexes are already properly defined in `firestore.indexes.json`.

## Solution Options

### Option 1: Deploy Indexes Using Firebase CLI (Recommended)

If you have access to a terminal with Firebase CLI installed:

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Authenticate with Firebase**:
   ```bash
   firebase login
   ```

3. **Deploy the indexes**:
   ```bash
   npm run deploy-indexes
   ```
   
   Or directly:
   ```bash
   firebase deploy --only firestore:indexes
   ```

### Option 2: Manual Index Creation via Firebase Console

If you can't use the CLI, you can create the indexes manually through the Firebase Console:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`eduquest3004`)
3. Navigate to Firestore Database > Indexes tab
4. Click "Create Index" for each required composite index:

   **Index 1: userQuizAttempts**
   - Collection ID: `userQuizAttempts`
   - Query scope: Collection
   - Fields:
     - `userId` (Ascending)
     - `completedAt` (Descending)

   **Index 2: quizzes**
   - Collection ID: `quizzes`
   - Query scope: Collection
   - Fields:
     - `subjectId` (Ascending)
     - `createdAt` (Ascending)

   **Index 3: userAchievements**
   - Collection ID: `userAchievements`
   - Query scope: Collection
   - Fields:
     - `userId` (Ascending)
     - `unlockedAt` (Descending)

### Option 3: Use the Direct Links from Error Messages

The error messages in your console include direct links to create each index:

1. Click on the links provided in the browser console error messages
2. These links will take you directly to the Firebase console with the index configuration pre-filled
3. Click "Create Index" for each required index

## Verification

After deploying the indexes:

1. Wait a few minutes for the indexes to finish building (they'll show as "building" initially)
2. Refresh your application
3. The Firestore query errors should disappear
4. Your application should work properly without the 400 errors

## Additional Notes

- Indexes can take a few minutes to build after deployment
- During this time, queries might still fail until the indexes are fully created
- Once the indexes are built, the errors will disappear automatically
- You can check the status of your indexes in the Firebase Console under Firestore Database > Indexes tab

## Troubleshooting

If you continue to see errors after deploying indexes:

1. Double-check that all required indexes have been deployed
2. Verify that the field names and sort orders match exactly
3. Check the Firebase Console to ensure indexes are in "Enabled" status (not "Creating")
4. Clear your browser cache and refresh the application