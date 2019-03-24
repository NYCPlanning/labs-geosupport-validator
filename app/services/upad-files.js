import Service from '@ember/service';

const FOLD = 'ERROR RECORDS: ';
const boroCodeLookup = {
  '1': 'Manhattan',
  '2': 'Bronx',
  '3': 'Brooklyn',
  '4': 'Queens',
  '5': 'Staten Island',
};
const patterns = [{
  fileNameMatcher: 'BL',
  length: 56,
  boroCodeLength: 13,
}, {
  fileNameMatcher: '1A',
  length: 62,
  boroCodeLength: 13,
}, {
  fileNameMatcher: 'BN',
  length: 42,
  boroCodeLength: 17,
}];
const flatten = (array) => array.reduce((acc, curr) => acc.concat(curr), []);

export default class UpadFilesService extends Service {
  files = [];
  lines = [];

  add(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const { name: rawName } = file;
      const extractedName = (rawName.match(/[^(]+(?=\))/) || [])[0];
      const name = `${extractedName}.txt`;

      // sniff out the file type for correct slicing pattern
      const { length, boroCodeLength, fileNameMatcher } = patterns
        .find(({ fileNameMatcher }) => name.includes(fileNameMatcher));
      const fileText = event.target.result;

      // push up the file
      this.files.pushObject({
        name,
        content: fileText,
      });

      const date = fileText.split('\n')[2].slice(35,47);

      // split along the folds
      const folds = flatten(
        fileText.split(FOLD).slice(1)
      );

      // split along lines
      const lines = flatten(
        folds.map(pagelike => pagelike.split('\n'))
      );

      let currentHeader = '';
      // slice up the lines based on static patterns
      lines.forEach((line = '') => {
        const isHeader = line.includes(' GBAT ');

        if (isHeader) {
          currentHeader = line;
        }

        const left = line.slice(1,3);
        const right = line.slice(length, length + 2);
        const boroCode = line.slice(boroCodeLength, boroCodeLength + 1);

        this.lines.pushObject({
          currentHeader,
          date,
          left,
          right,
          line,
          name,
          fileType: fileNameMatcher,
          boroName: boroCodeLookup[boroCode],
          id: `${line} ${currentHeader}`,
        });
      });
    };

    reader.readAsText(file);
  }
}
