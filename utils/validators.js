const isValidEmail = (email) => {
  const emailRegex = new RegExp(
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  );
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  const passwordRegex = new RegExp(
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
  );
  return passwordRegex.test(password);
};

module.exports = { isValidEmail, isValidPassword };
