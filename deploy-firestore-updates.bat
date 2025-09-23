@echo off
echo ========================================
echo   EduQuest Firestore Updates Deployment
echo ========================================
echo.

echo Deploying Firestore rules and indexes...
echo.

REM Deploy Firestore rules
echo [1/2] Deploying Firestore security rules...
firebase deploy --only firestore:rules

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to deploy Firestore rules
    pause
    exit /b 1
)

echo ✅ Firestore rules deployed successfully!
echo.

REM Deploy Firestore indexes
echo [2/2] Deploying Firestore indexes...
firebase deploy --only firestore:indexes

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to deploy Firestore indexes
    pause
    exit /b 1
)

echo ✅ Firestore indexes deployed successfully!
echo.

echo ========================================
echo   🎉 Deployment Complete! 🎉
echo ========================================
echo.
echo All Firestore updates have been deployed:
echo ✅ Security rules updated
echo ✅ Composite indexes created
echo ✅ Ready for production use
echo.
echo The app now supports:
echo • Class-based student organization
echo • Multi-language functionality
echo • Enhanced security rules
echo • Optimized query performance
echo.
pause