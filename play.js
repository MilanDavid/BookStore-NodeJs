const name = "Milan";
let age = 36;
const hasHobies = true;

age = 40;

const summarizeUser = (userName, userAge, userHasHobies) => {
  return (
    "Name is " +
    userName +
    ", age is " +
    userAge +
    " and has hobbies: " +
    userHasHobies
  );
}

console.log(summarizeUser(name, age, hasHobies));
