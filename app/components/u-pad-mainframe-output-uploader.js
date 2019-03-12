import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object'; 
import { group } from 'd3-array';

const TOKEN = 'ERROR RECORDS: TEST GBAT USING TEST DATA';

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

export default class UPadMainframeOutputUploader extends Component {
  // { name, text }
  _files = [];

  lines = [];

  @computed('processedFiles')
  get mismatches() {
    return this.processedFiles
      .filter(({ left, right, line }) => {
        return left !== right
          && line.slice(0,4).match(/ [1-9a-z]{2}-/);
      });
  }

  @computed('_files.@each')
  get processedFiles() {
    const files = this._files;
    const grouped = group(files, f => {
      const { fileNameMatcher } = patterns
        .find(({ fileNameMatcher }) => f.name.includes(fileNameMatcher));
      return fileNameMatcher;
    });

    return flatten(patterns
      .map(({ fileNameMatcher, length }) => {
        const filesOfType = grouped.get(fileNameMatcher);

        if (filesOfType) {
          const fileText = filesOfType.map(({ text }) => text); 
          const folds = flatten(
            fileText.map(file => file.split(TOKEN).slice(1))
          ) // split along the folds

          const lines = flatten(
            folds.map(pagelike => pagelike.split('\n'))
          ) // split along lines

          return lines
            .map((line = '') => {
              const left = line.slice(1,3);
              const right = line.slice(length, length + 2);

              return { left, right, line };
            });
        }
      })
      .filter(Boolean));
  }

  @action
  handleFile(file) {
    const reader = new FileReader();

    reader.onload = (event) => {
      const { name } = file;
      const text = event.target.result;

      this._files.pushObject({
        name,
        text,
      });
    };

    reader.readAsText(file);
  }
}
