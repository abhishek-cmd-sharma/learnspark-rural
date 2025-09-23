@echo off
echo Deploying Firestore indexes...
echo.

echo Step 1: Installing Firebase CLI (if not already installed)...
npm install -g firebase-tools
echo.

echo Step 2: Authenticating with Firebase...
firebase login
echo.

echo Step 3: Deploying Firestore indexes...
firebase deploy --only firestore:indexes
echo.

echo Deployment complete! Check your Firebase console to verify the indexes were created.
pause
