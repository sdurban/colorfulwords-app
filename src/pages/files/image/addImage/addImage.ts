import {Component} from "@angular/core";
import {Platform, ViewController} from "ionic-angular";
import {DatabaseService} from "../../../../providers/DatabaseService";
import {File} from "@ionic-native/file";
import {Camera, CameraOptions} from "@ionic-native/camera";
import {FilePath} from "@ionic-native/file-path";

@Component({
  selector: 'add-image',
  templateUrl: 'addImage.html'
})
export class AddImagePage {
  readonly imagePath:string;
  filePathName:string;
  file = { title: '', path: ''};
  recording:boolean = false;
  nameImageFile:string = '';
  options: CameraOptions = {};

  constructor(public database: DatabaseService, public viewCtrl: ViewController, public fileSystem: File, public camera: Camera, public platform: Platform, public filePath: FilePath) {
    this.options = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    if(this.platform.is('android')) {
      this.filePathName = this.fileSystem.externalDataDirectory;
    } else {
      this.filePathName = this.fileSystem.dataDirectory;
    }
    this.imagePath = this.filePathName + "images/";
    this.fileSystem.checkDir(this.filePathName, "images").then(exists => {
      if(!exists) {
        this.fileSystem.createDir(this.filePathName, "images", false);
      }
    }).catch((err) => {
      this.fileSystem.createDir(this.filePathName, "images", false);
    });
  }

  public takePicture(sourceType) {
    this.options.sourceType = sourceType;
    this.camera.getPicture(this.options).then((imagePath) => {
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
    });
  }

  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.fileSystem.copyFile(namePath, currentName, this.imagePath, newFileName).then(success => {
      this.file.path = newFileName;
    }, error => {

    });
  }

  private createFileName() {
    let nameFile = new Date().toISOString() + Math.random().toString(36).substring(9);
    nameFile = nameFile.replace(/\-/g, "").replace(/\:/g, "").replace(/\./g, "");
    nameFile = nameFile + ".jpg";
    return nameFile;
  }

  public createPicture() {
    this.database.createFile(this.file.title, this.file.path, "IMAGE").then(() => {
      this.viewCtrl.dismiss();
    });
  }

  public fullImagePath(path) {
    return ((this.platform.is('android') ? this.fileSystem.externalDataDirectory : this.fileSystem.dataDirectory) + "images/" + path).replace(/^file:\/\//, '');
  }
}
