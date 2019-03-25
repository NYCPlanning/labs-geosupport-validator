import { setProperties } from '@ember/object';
import { computed } from '@ember-decorators/object';
import fetch from 'fetch';  

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
      .find(({ fileNameMatcher }) => this.name.includes(fileNameMatcher));
  }

  @computed('pattern')
  get fileNameMatcher() {
    return this.pattern.fileNameMatcher;
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
  @computed('line', 'fileNameMatcher')
  get location() {
    // handling for line type
    if (this.fileNameMatcher === '1A') {
      const addressNumber = this.line.slice(14, 28).trim();
      const street = this.line.slice(27, 61).trim();

      return {
        addressNumber,
        street,
      };
    }

    if (this.fileNameMatcher === 'BN') {
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
