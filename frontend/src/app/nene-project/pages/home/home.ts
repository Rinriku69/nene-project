import { Component } from '@angular/core';
import { Icons } from "../../components/icons/icons";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Icons,RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
