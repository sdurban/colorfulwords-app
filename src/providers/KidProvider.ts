import {Injectable} from "@angular/core";

@Injectable()
export class KidProvider {
  public readonly ADULT_MODE = 0;
  public readonly KID_MODE = 1;
  public status: number;

  public constructor() {
    this.status = this.ADULT_MODE;
  }

  public goAdult() {
    this.status = this.ADULT_MODE;
  }

  public goKid() {
    this.status = this.KID_MODE;
  }
}
