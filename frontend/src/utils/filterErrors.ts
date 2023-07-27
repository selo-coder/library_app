export const filterErrors = (errorList:string[], 
                             filteredErrors:string[]):string[] => {
return errorList.filter((error:string) => !filteredErrors.includes(error))
}