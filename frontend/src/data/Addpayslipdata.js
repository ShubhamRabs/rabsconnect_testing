
export const paysliptomonth = [
    { value: "01", label: "Janaury" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  
  export const getYearsData = () => {
    const currentYear = new Date().getFullYear();
    const yearsData = []
  
    for (let year = currentYear; year <= currentYear + 100; year++) {
      // const value = /* insert your value calculation here */;
      yearsData.push(year.toString());
    }
    return yearsData;
  };
  
  // export function Paysliptoyear (){
  //   for (let year =2000; year <= 2050; year++){
  //     console.log(year);
  //     console.log(Paysliptoyear);
  //   }
  // } 
  
  export const paysliptoempname = [
    { value: "", label: "" },
    { value: "", label: "" },
  ];
  
  