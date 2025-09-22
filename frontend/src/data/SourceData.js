import Google from "./../assets/Image/source/google.png";
import Facebook from "./../assets/Image/source/facebook.png";
import Housing from "./../assets/Image/source/housing.png";
import MagicBricks from "./../assets/Image/source/magicbricks.png";
import Acres from "./../assets/Image/source/acres.png";
import Bayut from "./../assets/Image/source/bayut.png";
import Propertyfinder from "./../assets/Image/source/propertyfinder.png";
import Dubizzle from "./../assets/Image/source/dubizzle.png";
import Linkedin from "./../assets/Image/source/linkedin.png";
import Indeed from "./../assets/Image/source/indeed.png";
import JobHai from "./../assets/Image/source/job_hai.png";
import Naukri from "./../assets/Image/source/naukri.png";
import Workindia from "./../assets/Image/source/workindia.png";

let crm_countries = document.getElementById('crm_countries');

let LeadSourceData = [
  { source: "facebook", lead_count: 0, SourceIcon: Facebook },
  { source: "google", lead_count: 0, SourceIcon: Google },
];

if(crm_countries.value.includes('India')) {
  LeadSourceData.push(...[
    { source: "housing", lead_count: 0, SourceIcon: Housing },
    { source: "magicbricks", lead_count: 0, SourceIcon: MagicBricks },
    { source: "99acres", lead_count: 0, SourceIcon: Acres },
  ]);
}

if(crm_countries.value.includes('UAE')) {
  LeadSourceData.push(...[
    { source: "bayut", lead_count: 0, SourceIcon: Bayut },
    { source: "propertyfinder", lead_count: 0, SourceIcon: Propertyfinder },
    { source: "dubizzle", lead_count: 0, SourceIcon: Dubizzle },    
  ])
}

export { LeadSourceData };

export const CandidateSourceData = [
  { source: "facebook", lead_count: 0, SourceIcon: Facebook },
  { source: "linkedin", candidate_count: 0, SourceIcon: Linkedin },
  { source: "google", candidate_count: 0, SourceIcon: Google },
  { source: "workindia", candidate_count: 0, SourceIcon: Workindia },
  { source: "jobhai", candidate_count: 0, SourceIcon: JobHai },
  { source: "naukri", candidate_count: 0, SourceIcon: Naukri },
  { source: "indeed", candidate_count: 0, SourceIcon: Indeed },
];
