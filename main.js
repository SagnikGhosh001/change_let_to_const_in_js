const dbg = (x) => {
  console.log(x);
  return x;
};

const isReassign = (variable, code) =>
  new RegExp(`(?<!\\s*let\\s+)${variable}\\s+=`, "g").test(code);

const filterOutReassignedVariables = (variables, code) =>
  variables.filter((variable) => !isReassign(variable, code));

const transformLetToConst = (variables, code) =>
  filterOutReassignedVariables(variables, code)
    .reduce((newCode, variable) => {
      const regExp = new RegExp(`\\s*let\\s+(${variable})\\s+`);
      return newCode.replace(regExp, "\nconst $1 ");
    }, code);

const searchLetVariables = (code) => {
  const regExp = /.*let\s+(\w+)/g;
  const matchedElemets = code.matchAll(regExp);
  const letVariables = [...matchedElemets].map((matches) => matches[1]);
  return letVariables;
};

const main = () => {
  const filePath = "./input.js";
  const code = Deno.readTextFileSync(filePath);
  const letVariables = searchLetVariables(code);
  const parsedCode = transformLetToConst(letVariables, code);
  Deno.writeTextFileSync(filePath, parsedCode);
};

main();
