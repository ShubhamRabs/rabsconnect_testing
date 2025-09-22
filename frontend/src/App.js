// Author: Shubham Sonkar

// Import necessary dependencies and styles
import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import Mui from "./context/Mui";
import Bootstrap from "./context/Bootstrap";
import MyGlobalData from "./context/Global";
import Main from "./setting/Main";
import { ErrorBoundary } from "react-error-boundary";
import Cookies from "js-cookie";
import "./App.css";

// Create a new instance of QueryClient
export const queryClient = new QueryClient();

// Author: Shubham Sonkar
// Define the main App component
const App = () => {
  // Local state to manage loading and notification
  const [loading, setLoading] = React.useState(true);

  // Get the spinner element by ID
  const spinner = document.getElementById("spinner");

  // Hide the spinner after a delay and update the loading state
  if (spinner) {
    setTimeout(() => {
      spinner.style.display = "none";
      setLoading(false);
    }, 200);
  }

  const HandleErrorBoundry = () => {
    Cookies.remove("user", { path: "/", domain: window.location.hostname });
    Cookies.remove("type", { path: "/", domain: window.location.hostname });
    Cookies.remove("role", { path: "/", domain: window.location.hostname });
    Cookies.remove("username", { path: "/", domain: window.location.hostname });
    Cookies.remove("u_id", { path: "/", domain: window.location.hostname });
    Cookies.remove("token", { path: "/", domain: window.location.hostname });
    Cookies.remove("module_privilege", {
      path: "/",
      domain: window.location.hostname,
    });
   localStorage.setItem("currScreen", "Login");
   window.location.reload(true);
  }

  // Render the application once loading is complete
  return (
    !loading && (
      // <ErrorBoundary fallback={<HandleErrorBoundry />}>
        <QueryClientProvider client={queryClient}>
          {/* Wrapping components with Mui, Bootstrap, and MyGlobalData context providers */}
          <Mui>
            <Bootstrap>
              <MyGlobalData>
                {/* Main component representing the main content of the application */}
                <Main />
              </MyGlobalData>
            </Bootstrap>
          </Mui>
        </QueryClientProvider>
      // </ErrorBoundary>
    )
  );
};

// Export the App component as the default export
export default App;
