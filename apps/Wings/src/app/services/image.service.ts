import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class ImageService {
  constructor(private httpClient: HttpClient) {}

  //to get Random image
  getData(url: string): Observable<string> {
    return this.httpClient
      .get(url, { responseType: "blob" })
      .pipe(switchMap(response => this.readFile(response)));
  }

  private readFile(blob: Blob): Observable<string> {
    return Observable.create(obs => {
      const reader = new FileReader();

      reader.onerror = err => obs.error(err);
      reader.onabort = err => obs.error(err);
      reader.onload = () => obs.next(reader.result);
      reader.onloadend = () => obs.complete();

      return reader.readAsDataURL(blob);
    });
  }

  // download Image
  download(img) {
    const imgUrl = img;
    const imgName = imgUrl.substr(imgUrl.lastIndexOf("/") + 1);
    this.httpClient
      .get(imgUrl, { responseType: "blob" as "json" })
      .subscribe((res: any) => {
        const file = new Blob([res], { type: res.type });

        const blob = window.URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = blob;
        link.download = imgName;

        // Version link.click() to work at firefox
        link.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window
          })
        );

        setTimeout(() => {
          // firefox
          window.URL.revokeObjectURL(blob);
          link.remove();
        }, 100);
      });
  }
}
