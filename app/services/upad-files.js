import Service from '@ember/service';
import Line from 'labs-upad-validate/models/line';

const FOLD = 'ERROR RECORDS: ';
const flatten = (array) => array.reduce((acc, curr) => acc.concat(curr), []);

export default class UpadFilesService extends Service {
  files = [];

  // array of Line classes
  lines = [];

  add(file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const { name: rawName } = file;
      const extractedName = (rawName.match(/[^(]+(?=\))/) || [])[0];
      const name = `${extractedName}.txt`;
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

        this.lines.pushObject(new Line({
          currentHeader,
          date,
          line,
          name,
        }));
      });
    };

    reader.readAsText(file);
  }
}
