import Component from '@ember/component';
import { action, computed } from '@ember-decorators/object'; 
import { inject as service } from '@ember-decorators/service';

export default class UPadMainframeOutputUploader extends Component {
  @service
  upadFiles;

  @action
  handleFile(file) {
    this.upadFiles.add(file);
  }
}
