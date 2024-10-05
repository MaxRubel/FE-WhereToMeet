const isValidPhoneNumber = (phoneNumber: string): boolean => {
  // Corrected regex pattern
  const phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  return phoneRegex.test(phoneNumber);
};

export default isValidPhoneNumber;
