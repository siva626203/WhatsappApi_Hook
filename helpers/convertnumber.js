const ConvertNumber= (number)=>{
 const cleanNumber = number.replace(/\D/g, '');
      
      console.log(`Cleaned number: ${cleanNumber}`);

      // Check if the number length is valid (11 digits for Brazilian mobile numbers)
      if (cleanNumber.length < 10 || cleanNumber.length > 12) {
        console.error(`Invalid phone number length: ${cleanNumber.length}`);
        throw new Error('Invalid phone number length');
      }

      // Handle 12-digit numbers with country code
      let formattedNumber;
      if (cleanNumber.length === 11) {
        // Format the phone number with country code and area code
        const countryCode = cleanNumber.substring(0, 2);
        const areaCode = cleanNumber.substring(2, 7); // Assuming area code can be 5 digits
        const firstPart = cleanNumber.substring(7, 11); // Local number (4 digits)

        formattedNumber = `(${countryCode}) ${areaCode}-${firstPart}`;
      } else if (cleanNumber.length === 12) {
        // Handle case where number includes country code + area code
        const areaCode = cleanNumber.substring(2, 7); // Area code (5 digits)
        const firstPart = cleanNumber.substring(7, 11); // Local number (4 digits)
        const secondPart = cleanNumber.substring(11); // Remaining digits if any

        formattedNumber = `(${cleanNumber.substring(0, 2)}) ${areaCode}-${firstPart}${secondPart}`;
         console.log(`Formatted number: ${formattedNumber}`)
         return formattedNumber
      } else {
        throw new Error('Unsupported phone number length');
      }
}
module.exports=ConvertNumber