interface ArgumentLengths {
  [arg: string]: number;
}

const argumentLengths: ArgumentLengths = {
  "--config": 1
};

export type ProcessArguments = {
  "--config": string;
};

type ArgTuple = [string, number];
const getNextArgs = ([argumentName, length]: ArgTuple, iterIndex: number) => {
  const valueStartIndex = iterIndex + 1;
  const nextIterIndex = valueStartIndex + length;
  const value = process.argv.slice(valueStartIndex, nextIterIndex);
  return {
    nextIterIndex,
    partialArgs: {
      [argumentName]: value.length === 1 ? value[0] : value
    }
  };
};

export const getProcessArguments: () => ProcessArguments = () => {
  const maxIter = process.argv.length - 1;
  let args = {
    "--config": "./open-api-mock.config.js"
  };

  for (let iterIndex = 0; iterIndex < maxIter; ) {
    const arg = process.argv[iterIndex];
    const isDefined = argumentLengths.hasOwnProperty(arg);

    if (isDefined) {
      const resolver: ArgTuple = [arg, argumentLengths[arg]];
      const { nextIterIndex, partialArgs } = getNextArgs(resolver, iterIndex);
      args = { ...args, ...partialArgs };
      iterIndex = nextIterIndex;
    } else {
      iterIndex += 1;
    }
  }

  return args;
};
