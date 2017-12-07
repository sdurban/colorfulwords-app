import {Component} from "@angular/core";
import {ViewController} from "ionic-angular";
import {DatabaseService} from "../../../../providers/DatabaseService";
import {File} from "@ionic-native/file";
import {Media, MediaObject} from "@ionic-native/media";

@Component({
  selector: 'add-sound',
  templateUrl: 'addSound.html'
})
export class AddSoundPage {
  readonly soundPath:string;
  file = { title: '', path: ''};
  recording:boolean = false;
  fileRecord:MediaObject;
  nameRecordingFile:string = '';

  constructor(public database: DatabaseService, public viewCtrl: ViewController, public fileSystem: File, public media: Media) {
    this.soundPath = this.fileSystem.dataDirectory + "sounds/";
    this.fileSystem.checkDir(this.fileSystem.dataDirectory, "sounds").then(exists => {
      if(!exists) {
        this.fileSystem.createDir(this.fileSystem.dataDirectory, "sounds", false);
      }
    }).catch((err) => {
      this.fileSystem.createDir(this.fileSystem.dataDirectory, "sounds", false);
    });
    }

  createSound() {
    this.database.createFile(this.file.title, this.file.path, "SOUND").then(() => {
      this.viewCtrl.dismiss();
    });
  }

  recordSound() {
    let nameFile = new Date().toISOString() + Math.random().toString(36).substring(9);
    nameFile = nameFile.replace(/\-/g, "").replace(/\:/g, "").replace(/\./g, "");
    nameFile = nameFile + ".wav";
    this.nameRecordingFile = this.soundPath.replace(/^file:\/\//, '') + nameFile;
    this.fileSystem.createFile(this.soundPath, nameFile, true).then(() => {
      this.fileRecord = this.media.create(this.nameRecordingFile);
      this.fileRecord.startRecord();
      this.recording = true;
    });
  }

  stoprecordSound() {
    this.fileRecord.stopRecord();
    this.file.path = this.nameRecordingFile;
    this.nameRecordingFile = '';
    this.recording = false;
  }

  playSound() {
    this.fileRecord.play();
  }
}
