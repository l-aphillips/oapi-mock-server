const corpuses = [
  {
    id: 0,
    corpusName: "Documents",
    accessRight: "public_access",
    owner: "mondeca.fr"
  },
  {
    id: 1,
    corpusName: "Articles",
    accessRight: "public_access",
    owner: "mondeca.fr"
  },
  {
    id: 2,
    corpusName: "Videos",
    accessRight: "public_access",
    owner: "mondeca.fr"
  },
  {
    id: 3,
    corpusName: "Photos",
    accessRight: "public_access",
    owner: "mondeca.fr"
  }
];

const findCorpus = name =>
  corpuses.find(({ corpusName }) => corpusName === name);

module.exports = {
  get: ({ corpusName }) => {
    return corpusName ? findCorpus(corpusName) : corpuses;
  },
  put: ({ corpusName }, body) => {
    const corpus = findCorpus(corpusName);
    Object.assign(corpus, body);
    return corpus;
  }
};
