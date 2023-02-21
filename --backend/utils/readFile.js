const fsPromises = require('fs').promises;

const getFileData = (filePath, res) => fsPromises
  .readFile(filePath, { encoding: 'utf8' })
  .then((data) => JSON.parse(data))
  .catch(() => {
    res.status(500).send({ Message: 'Internal Error' });
  });

module.exports = getFileData;
