import { TAction } from "../Type";
import { UserActions } from "./UserActions";

const ExtractFunctionParams = (func: any): string[] => {
  const fnStr = func
    .toString()
    .replace(
      /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/gm,
      ""
    );

  let params =
    fnStr
      .slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")"))
      .match(/([^\s,]+)/g) || [];

  // Dealing with parameters passed as an object
  while (params.indexOf("{") !== -1) {
    const objStartIndex = params.indexOf("{");
    const objEndIndex = params.indexOf("}");
    params.splice(objStartIndex, objEndIndex - objStartIndex);
    params[objStartIndex] = params.slice(objStartIndex + 1, objEndIndex);
  }

  return params;
};

export const classes = {
  Users: UserActions,
};

const getMethodsFromClass = (classRef: TAction) => {
  return Object.getOwnPropertyNames(classRef).filter(
    (e: string) => typeof classRef[e as keyof TAction] === "function"
  );
};

const processClassMethods = (classRef: TAction, methodNames: string[]) =>
  methodNames.reduce(
    (acc, name: string) => ({
      ...acc,
      [name]: ExtractFunctionParams(classRef[name as keyof TAction])[2] || [],
    }),
    {}
  );

export const config = Object.keys(classes).reduce((func, key: string) => {
  const classRef: TAction = classes[key as keyof TAction];
  const methodNames = getMethodsFromClass(classRef);
  return {
    ...func,
    [key]: processClassMethods(classRef, methodNames),
  };
}, {});
