import Component from '@ember/component';
import { inject as service } from '@ember-decorators/service';
import { computed, action } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed'; 

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
      .uniqBy('id')
      .sortBy('currentHeader');
  }

  @action
  toggleAccordion() {
    this.toggleProperty('allLinesOpen');
  }
}
