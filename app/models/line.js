import { setProperties } from '@ember/object';
import { computed } from '@ember-decorators/object';
import fetch from 'fetch';  

const boroCodeLookup = {
  '1': 'MN',
  '2': 'BX',
  '3': 'BK',
  '4': 'QN',
  '5': 'SI',
};
const patterns = [{
  fileNameMatcher: /BL/i,
  functionCode: 'BL',
  length: 56,
  boroCodeLength: 13,
}, {
  fileNameMatcher: /1A/i,
  functionCode: '1A',
  length: 62,
  boroCodeLength: 13,
}, {
  fileNameMatcher: /BN/i,
  functionCode: 'BN',
  length: 42,
  boroCodeLength: 17,
}, {
  fileNameMatcher: /AP/i,
  functionCode: 'AP',
  length: 42,
  boroCodeLength: 17,
}, {
  fileNameMatcher: /APX/i,
  functionCode: 'APX',
  length: 42,
  boroCodeLength: 17,
}, {
  fileNameMatcher: /1/i,
  functionCode: '1',
  length: 42,
  boroCodeLength: 17,
}, {
  fileNameMatcher: /1R/i,
  functionCode: '1R',
  length: 42,
  boroCodeLength: 17,
}, {
  fileNameMatcher: /1AX/i,
  functionCode: '1AX',
  length: 62,
  boroCodeLength: 13,
}, {
  fileNameMatcher: /1E/i,
  functionCode: '1E',
  length: 42,
  boroCodeLength: 17,
}, {
  fileNameMatcher: /1ER/i,
  functionCode: '1ER',
  length: 42,
  boroCodeLength: 17,
}, {
  fileNameMatcher: /1EX/i,
  functionCode: '1EX',
  length: 42,
  boroCodeLength: 17,
}, {
  fileNameMatcher: /1EXR/i,
  functionCode: '1EXR',
  length: 42,
  boroCodeLength: 17,
}, {
  fileNameMatcher: /BLX/i,
  functionCode: 'BLX',
  length: 42,
  boroCodeLength: 17,
}, {
  fileNameMatcher: /BNX/i,
  functionCode: 'BNX',
  length: 42,
  boroCodeLength: 17,
}].sort((a, b) => b.functionCode - a.functionCode);

const GEOSEARCH_URL = 'https://geosearch.planninglabs.nyc/v1/autocomplete?text=';

export default class Line {
  constructor(props) {
    setProperties(this, props);
  }

  currentHeader = '';
  date = '';
  line = '';
  name = '';

  @computed('line')
  get asyncSearchResults() {
    const extracted = this.line.slice(14, 61).trim();

    if (this.pattern.fileNameMatcher === '1A') {
      return fetch(`${GEOSEARCH_URL}${extracted}`)
        .then(blob => blob.json());
    }
  }

  @computed('name')
  get pattern() {
    // sniff out the file type for correct slicing pattern
    return patterns
      .find(({ fileNameMatcher }) => this.name.match(fileNameMatcher));
  }

  @computed('pattern')
  get functionCode() {
    return this.pattern.functionCode;
  }

  @computed('line', 'currentHeader')
  get id() {
    return `${this.line} ${this.currentHeader}`;
  }

  @computed('boroCode')
  get boroName() {
    return boroCodeLookup[this.boroCode];
  }

  @computed('line')
  get left() {
    return this.line.slice(1,3);
  }

  @computed('line')
  get right() {
    return this.line.slice(this.pattern.length, this.pattern.length + 2);
  }

  @computed('line')
  get boroCode() {
    return this.line.slice(
      this.pattern.boroCodeLength,
      this.pattern.boroCodeLength + 1,
    );
  }

  // this is sensitive to the type
  // this makes it locatable, however,
  // only in specific ways (address, BBL, BIN)
  @computed('line', 'functionCode')
  get location() {
    // handling for line type
    if (this.functionCode === '1A') {
      const addressNumber = this.line.slice(14, 28).trim();
      const street = this.line.slice(27, 61).trim();

      return {
        addressNumber,
        street,
      };
    }

    if (this.functionCode === 'BN') {
      // this a manual note added in QA process, may not work
      const fuzzyAddress = this.line.split('/').reverse()[0];

      return fetch(`${GEOSEARCH_URL}${fuzzyAddress}`)
        .then(blob => blob.json())
        .then(results => {
          const { features: [firstResult] } = results;

          return {
            addressNumber: firstResult.properties.housenumber,
            street: firstResult.properties.street,
          };
        });
    }

    return this.line;
  }
}
