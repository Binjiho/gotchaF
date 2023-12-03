export const calculateAge = birthYear => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  return age;
};
