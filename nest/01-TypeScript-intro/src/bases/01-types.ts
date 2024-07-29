export const name = "John";
export const age = 30;
export const isValid: boolean = true;

console.log(name);

export const templateString = `Hello ${name}
multiline
" quote
' single quote
\$ dollar symbol escaped
expressions ${1 + 1}
`;

console.log(templateString);
