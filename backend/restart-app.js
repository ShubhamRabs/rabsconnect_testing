const axios = require('axios');

// const cpanelHost = 'rabs.support';
// const cpanelUsername = 'rabssupport';
// const cpanelPassword = '1zsakdA,L*i}';
// const appName = 'cicd crm backend';
// const appPath = '/public_html/cicd-backend.rabs.support';
const title = process.env.CPANEL_PASSWORD;
console.log('Password', title,'host',process.env.CRM_HOSTNAME,'username',process.env.CRM_CPANEL_USERNAME,'password',process.env.CRM_CPANEL_PASSWORD,'appName',process.env.CRM_APP_NAME,'appPath',process.env.CRM_APP_PATH);
const cpanelHost = process.env.CRM_HOSTNAME;
const cpanelUsername = process.env.CRM_CPANEL_USERNAME;
const cpanelPassword = process.env.CRM_CPANEL_PASSWORD;
const appName = process.env.CRM_APP_NAME;
const appPath = process.env.CRM_APP_PATH;

async function enableApp() {
  try {
    // Enable the application
    const enableBackendResponse = await axios.get(`https://${cpanelHost}:2083/execute/PassengerApps/enable_application?name=${appName}`, {
      auth: {
        username: cpanelUsername,
        password: cpanelPassword
      }
    });
    // console.log("responses", enableBackendResponse);
    console.log('Application started.');
    return enableBackendResponse;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

async function ensureDependenciesApp() {
  try {
    // Ensure Dependencies for the application
    const ensureDependenciesBackendResponse = await axios.get(`https://${cpanelHost}:2083/execute/PassengerApps/ensure_deps?type=npm&app_path=${appPath}`, {
      auth: {
        username: cpanelUsername,
        password: cpanelPassword
      }
    });
    // console.log("responses", ensureDependenciesBackendResponse);
    console.log('Packages installed.');
    return ensureDependenciesBackendResponse;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

async function disableApp() {
  try {
    // Disable the application
    const disableBackendResponse = await axios.get(`https://${cpanelHost}:2083/execute/PassengerApps/disable_application?name=${appName}`, {
      auth: {
        username: cpanelUsername,
        password: cpanelPassword
      }
    });
    // console.log("responses", disableBackendResponse);
    console.log('Application stopped.');
    return disableBackendResponse;
    // Add a delay if necessary (e.g., to wait for the app to stop completely)
    // await new Promise(resolve => setTimeout(resolve, 5000));
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

async function restartApp() {
  try {
    const disableBackendResponse = await disableApp();
    if (disableBackendResponse !== false && disableBackendResponse?.data?.status == 1) {
      const ensureDependenciesBackendResponse = await ensureDependenciesApp();
      if (ensureDependenciesBackendResponse !== false && ensureDependenciesBackendResponse?.data?.status == 1) {
        const enableBackendResponse = await enableApp();
        if (enableBackendResponse !== false && enableBackendResponse?.data?.status == 1) {
          console.log('App restarted successfully.');
        }
        else {
          console.log('App restart failed.');
        }
      }
      else {
        console.log('App Packages installation failed.');
        const enableBackendResponse = await enableApp();
        if (enableBackendResponse !== false && enableBackendResponse?.data?.status == 1) {
          console.log('App enabled again.');
        }
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

restartApp();