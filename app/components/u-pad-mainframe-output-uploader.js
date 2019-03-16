import Component from '@ember/component';
import { action } from '@ember-decorators/object'; 
import { inject as service } from '@ember-decorators/service';
import { tagName } from '@ember-decorators/component';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
// import DOCXify from 'html-docx-js'; // not available yet

@tagName('')
export default class UPadMainframeOutputUploader extends Component {
  @service
  upadFiles;

  @action
  handleFile(upload) {
    this.upadFiles.add(upload.blob);
  }

  @action
  async downloadFiles() {
    // this.upadFiles.files
    // console.log(jszip, saveAs);
    const zip = new JSZip();

    this.upadFiles.files.forEach(file => {
      zip.file(file.name, file.content);
    });

    const content = await zip.generateAsync({type:"blob"});

    saveAs(content, "files-formatted.zip");
  }
}
