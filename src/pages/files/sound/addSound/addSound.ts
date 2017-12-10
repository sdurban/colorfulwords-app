import {Component} from "@angular/core";
import {Platform, ViewController} from "ionic-angular";
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
  nameFile:string;
  recording:boolean = false;
  fileRecord:MediaObject;
  nameRecordingFile:string = '';

  constructor(public database: DatabaseService, public viewCtrl: ViewController, public fileSystem: File, public media: Media, public platform: Platform) {
    let dataDirectory = "";
    if(this.platform.is('android')) {
      dataDirectory = this.fileSystem.externalDataDirectory;
      this.soundPath = this.fileSystem.externalDataDirectory + "sounds/";
    } else {
      dataDirectory = this.fileSystem.dataDirectory;
      this.soundPath = this.fileSystem.dataDirectory + "sounds/";
    }

    this.fileSystem.checkDir(dataDirectory, "sounds").then(exists => {
      if(!exists) {
        this.fileSystem.createDir(dataDirectory, "sounds", false);
      }
    }).catch((err) => {
      this.fileSystem.createDir(dataDirectory, "sounds", false);
    });
    }

  createSound() {
    this.database.createFile(this.file.title, this.nameFile, "SOUND").then(() => {
      this.viewCtrl.dismiss();
    });
  }

  recordSound() {
    this.nameFile = new Date().toISOString() + Math.random().toString(36).substring(9);
    this.nameFile = this.nameFile.replace(/\-/g, "").replace(/\:/g, "").replace(/\./g, "");
    this.nameFile = this.nameFile + ".wav";
    this.nameRecordingFile = this.soundPath.replace(/^file:\/\//, '') + this.nameFile;
    this.fileSystem.createFile(this.soundPath, this.nameFile, true).then(() => {
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
