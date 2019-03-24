import Component from '@ember/component';
import { tagName } from '@ember-decorators/component';
import { computed, action } from '@ember-decorators/object';

@tagName('')
export default class LinesTableComponent extends Component {
  sortByKey = '';

  @computed('lines', 'sortByKey')
  get sorted() {
    return this.lines.sortBy(this.sortByKey);
  }

  @action
  changeSorting(key) {
    this.set('sortByKey', key);
  }
}
