import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { computed, action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed'; 

const SAMPLE_DATA = [
  {
    "left": "21",
    "right": "21",
    "line": " 21-119B 0003    4292075                  21UPAD19A1/RETIRED BIN\r",
    "name": "CQAGBNX.txt"
  },
  {
    "left": "21",
    "right": "21",
    "line": " 21-119B 0004    3000474                  21UPAD19A1/RETIRED BIN\r",
    "name": "CQAGBNX.txt"
  },
  {
    "left": "21",
    "right": "21",
    "line": " 21-119B 0006    2072304                  21UPAD19A1/RETIRED BIN\r",
    "name": "CQAGBNX.txt"
  },
  {
    "left": "21",
    "right": "21",
    "line": " 21-119B 0007    1001032                  21UPAD19A1/RETIRED BIN\r",
    "name": "CQAGBNX.txt"
  },
  {
    "left": "21",
    "right": "21",
    "line": " 21-119B 0010    5107810                  21UPAD19A1/RETIRED BIN\r",
    "name": "CQAGBNX.txt"
  },
  {
    "left": "21",
    "right": "21",
    "line": " 21- 19A 0013    3008771                  21UPAD18D4/RETIRED BIN\r",
    "name": "CQAGBNX.txt"
  },
  {
    "left": "21",
    "right": "21",
    "line": " 21- 19A 0014    2128892                  21UPAD18D4/RETIRED BIN\r",
    "name": "CQAGBNX.txt"
  },
  {
    "left": "21",
    "right": "21",
    "line": " 21- 19A 0016    1795005                  21UPAD18D4/RETIRED BIN\r",
    "name": "CQAGBNX.txt"
  },
  {
    "left": "21",
    "right": "21",
    "line": " 21- 19A 0020    5025305                  21UPAD18D3/RETIRED BIN\r",
    "name": "CQAGBNX.txt"
  },
];

export default class MismatchViewerComponent extends Component {
  @service
  upadFiles;

  @alias('upadFiles.lines')
  lines;

  allLinesOpen = false;

  @computed('upadFiles.lines.@each')
  get mismatches() {
    return this.upadFiles.lines
      .filter(({ left, right, line }) => {
        return left !== right // main test
          && line.slice(0,4).match(/ [1-9a-z]{2}-/i); // do the first few chars match this?
      })
      .uniqBy('line');
  }

  @action
  toggleAccordion() {
    this.toggleProperty('allLinesOpen');
  }
}
