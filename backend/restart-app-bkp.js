// const axios = require('axios');

// // const cpanelHost = 'rabs.support';
// // const cpanelUsername = 'rabssupport';
// // const cpanelPassword = '1zsakdA,L*i}';
// // const appName = 'cicd crm backend';
// // const appPath = '/public_html/cicd-backend.rabs.support';

// const cpanelHost = process.env.CPANEL_HOST;
// const cpanelUsername = process.env.CPANEL_USERNAME;
// const cpanelPassword = process.env.CPANEL_PASSWORD;
// const appName = process.env.APP_NAME;
// const appPath = process.env.APP_PATH;

// async function enableApp() {
//   try {
//     // Enable the application
//     const enableBackendResponse = await axios.get(`https://${cpanelHost}:2083/execute/PassengerApps/enable_application?name=${appName}`, {
//       auth: {
//         username: cpanelUsername,
//         password: cpanelPassword
//       }
//     });
//     // console.log("responses", enableBackendResponse);
//     console.log('Application started.');
//     return enableBackendResponse;
//   } catch (error) {
//     console.error('Error:', error);
//     return false;
//   }
// }

// async function ensureDependenciesApp() {
//   try {
//     // Ensure Dependencies for the application
//     const ensureDependenciesBackendResponse = await axios.get(`https://${cpanelHost}:2083/execute/PassengerApps/ensure_deps?type=npm&app_path=${appPath}`, {
//       auth: {
//         username: cpanelUsername,
//         password: cpanelPassword
//       }
//     });
//     // console.log("responses", ensureDependenciesBackendResponse);
//     console.log('Packages installed.');
//     return ensureDependenciesBackendResponse;
//   } catch (error) {
//     console.error('Error:', error);
//     return false;
//   }
// }

// async function disableApp() {
//   try {
//     // Disable the application
//     const disableBackendResponse = await axios.get(`https://${cpanelHost}:2083/execute/PassengerApps/disable_application?name=${appName}`, {
//       auth: {
//         username: cpanelUsername,
//         password: cpanelPassword
//       }
//     });
//     // console.log("responses", disableBackendResponse);
//     console.log('Application stopped.');
//     return disableBackendResponse;
//     // Add a delay if necessary (e.g., to wait for the app to stop completely)
//     // await new Promise(resolve => setTimeout(resolve, 5000));
//   } catch (error) {
//     console.error('Error:', error);
//     return false;
//   }
// }

// async function restartApp() {
//   try {
//     const disableBackendResponse = await disableApp();
//     if (disableBackendResponse !== false && disableBackendResponse?.data?.status == 1) {
//       const ensureDependenciesBackendResponse = await ensureDependenciesApp();
//       if (ensureDependenciesBackendResponse !== false && ensureDependenciesBackendResponse?.data?.status == 1) {
//         const enableBackendResponse = await enableApp();
//         if (enableBackendResponse !== false && enableBackendResponse?.data?.status == 1) {
//           console.log('App restarted successfully.');
//         }
//         else {
//           console.log('App restart failed.');
//         }
//       }
//       else {
//         console.log('App Packages installation failed.');
//         const enableBackendResponse = await enableApp();
//         if (enableBackendResponse !== false && enableBackendResponse?.data?.status == 1) {
//           console.log('App enabled again.');
//         }
//       }
//     }
//   } catch (error) {

//   }
// }

// restartApp();

// name: Install Node Modules, Fetch .env file, and Deploy to cPanel

// on:
//   push:
//     branches:
//       - uzair-ciCdTest  # Adjust branch name if necessary

// jobs:
//   deploy:
//     runs-on: ubuntu-latest

//     env:
//       ACTIONS_STEP_DEBUG: true  # Enable debugging

//     steps:
//     - name: Checkout code
//       uses: actions/checkout@v2

//     - name: Install Node.js modules
//       run: npm install

//     # Fetch .env file from cPanel
//     - name: Fetch .env file
//       id: fetch-env
//       uses: appleboy/scp-action@master
//       with:
//         host: ${{ secrets.RABS_DIGITAL_CPANEL_HOSTNAME }}
//         username: ${{ secrets.GIT_RABS_DIGITAL_CPANEL_USER }}
//         key: ${{ secrets.GIT_RABS_DIGITAL_SSH }}
//         passphrase: ${{ secrets.GIT_RABS_DIGITAL_PASSPHRASE }}
//         port: 22
//         debug: true
//         source: "/public_html/backend.cicd.rabsdigital.com/.env"  # Adjust the path to the .env file on the cPanel server
//         target: "./"  # Save the .env file to the current directory

//     # Check if .env file was fetched successfully
//     - name: Check if .env file was fetched
//       run: |
//         if [ -f .env ]; then
//           echo ".env file found."
//         else
//           echo ".env file not found."
//           exit 1
//         fi
//       if: steps.fetch-env.outcome == 'success'

//     # Load Environment Variables
//     - name: Load Environment Variables
//       run: export $(cat .env | xargs)

//     # Deploy to cPanel
//     - name: Deploy to cPanel
//       uses: SamKirkland/FTP-Deploy-Action@v4.3.4
//       with:
//         server: ${{ secrets.GIT_RABS_DIGITAL_SERVER }}
//         username: ${{ secrets.GIT_RABS_DIGITAL_USERNAME }}
//         password: ${{ secrets.GIT_RABS_DIGITAL_KEY }}
//         protocol: ${{ secrets.GIT_CPANEL_PROTOCOL }}
//         local-dir: ./  # Upload the entire repository directory
//         server-dir: /./backend.cicd.rabsdigital.com/

//     - name: Restart Server
//       run: node restart-app.js
