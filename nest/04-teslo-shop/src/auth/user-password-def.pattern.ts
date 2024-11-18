export const userPasswordDef = {
  pattern: /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  message: 'The password must have a Uppercase, lowercase letter and a number',
};
