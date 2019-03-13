import Service from '@ember/service';

const FOLD = 'ERROR RECORDS: ';
const patterns = [{
  fileNameMatcher: 'BL',
  length: 56,
}, {
  fileNameMatcher: '1A',
  length: 62,
}, {
  fileNameMatcher: 'BN',
  length: 42,
}];
const flatten = (array) => array.reduce((acc, curr) => acc.concat(curr), []);

export default class UpadFilesService extends Service {
  lines = [];

  add(file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const { name } = file;

      // sniff out the file type for correct slicing pattern
      const { length } = patterns
        .find(({ fileNameMatcher }) => name.includes(fileNameMatcher));
      const fileText = event.target.result;

      // split along the folds
      const folds = flatten(
        fileText.split(FOLD).slice(1)
      );

      // split along lines
      const lines = flatten(folds.map(pagelike => pagelike.split('\n')))

      // slice up the lines based on static patterns
      lines.forEach((line = '') => {
        const left = line.slice(1,3);
        const right = line.slice(length, length + 2);

        this.lines.pushObject({ left, right, line, name });
      });
    };

    reader.readAsText(file);
  }
}
