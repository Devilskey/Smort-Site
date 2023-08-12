import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Smort';

  //#region Development helper stuff
  developmentNavigator = false;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key == 'ArrowDown') {
      // Your row selection code
      console.log(event.key);
      if (this.developmentNavigator == false) {
        this.developmentNavigator = true;
        console.log(this.developmentNavigator);
      } else if (this.developmentNavigator == true) {
        this.developmentNavigator = false;
        console.log(this.developmentNavigator);
      }
    }
  }
  //#endregion
}
