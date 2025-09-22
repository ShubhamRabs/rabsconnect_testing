/*  
  Date: 25-09-2023 
  Author: Shubham Sonkar 
  Import the Axios library
*/
import axios from "axios";

/*  
  Date: 25-09-2023 
  Author: Shubham Sonkar
  Set a default configuration for Axios to include credentials with requests
*/
axios.defaults.withCredentials = true;

/*  
  Date: 25-09-2023 
  Author: Shubham Sonkar
  Create and export an instance of Axios with a specific baseURL
*/
export default axios.create({
  /*  
    Date: 25-09-2023 
    Author: Shubham Sonkar
    Set the base URL for the requests
  */
  baseURL: "http://localhost:3003", // Use this for local development
});
