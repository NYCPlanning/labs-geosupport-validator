import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import { computed, action } from '@ember-decorators/object';

@tagName('')
export default class LinesTableComponent extends Component {
  sortByKey = '';
  ascending = true;

  @computed('lines', 'sortByKey', 'ascending')
  get sorted() {
    const lines = this.lines.sortBy(this.sortByKey);

    if (!this.ascending) {
      lines.reverse();
    }

    return lines
  }

  @action
  changeSorting(key) {
    this.set('sortByKey', key);

    if (this.sortByKey === key) {
      this.toggleProperty('ascending');
    }
  }
}
