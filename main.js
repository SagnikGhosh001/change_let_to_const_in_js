const dbg = (x) => {
  console.log(x);
  return x;
};

const isReassign = (variable, code) => {
  const regExp = new RegExp(`(?<!\\s*let\\s*)${variable}\\s*=`, "g");
  return [variable, regExp.test(code)];
};

const changeLetToConst = (variables, code) => {
  const variableToChange = variables
    .map((variable) => isReassign(variable, code))
    .filter((ele) => !ele[1]);

  return variableToChange.reduce((newCode, variable) => {
    const regExp = new RegExp(`\\s*let\\s*(${variable[0]})\\s*`);
    return newCode.replace(regExp, "\nconst $1 ");
  }, code);
};

const searchLetVariables = (code) => {
  const regExp = /.*let\s*(\w+)/g;
  const matchedElemets = code.matchAll(regExp);
  const letVariables = [...matchedElemets].map((matches) => matches[1]);
  return letVariables;
};

const main = () => {
  const filePath = "./input.js";
  const code = Deno.readTextFileSync(filePath);
  const letVariables = searchLetVariables(code);
  const parsedCode = changeLetToConst(letVariables, code);
  Deno.writeTextFileSync(filePath, parsedCode);
};

main();
