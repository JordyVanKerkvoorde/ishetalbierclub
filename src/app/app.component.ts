import { Component, OnInit } from '@angular/core';
import { MOTDs } from './data/motd.data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  motd: string;

  ngOnInit(): void {
    this.motd = this.getMOTD();
    this.isTime()
  }

  isDday(): boolean {
    const today = new Date();

    return today.getDay() === 5;
  }

  isDayBefore(): boolean {
    const today = new Date();

    return today.getDay() === 4;
  }

  isTime(): boolean {
    const today = new Date();

    return today.getHours() < 20 && today.getHours() >= 17;
  }

  timeJustPassed(): boolean {
    const today = new Date(); 

    return today.getHours() >= 20;
  }

  getMOTD(): string {
    if(this.timeJustPassed() && this.isDday()) return MOTDs.justPassed[Math.floor(Math.random() * MOTDs.justPassed.length)]; 
    if(this.isDayBefore()) return MOTDs.tomorrow[Math.floor(Math.random() * MOTDs.tomorrow.length)]; 
    if(this.isTime() && this.isDday()) return MOTDs.itsTime[Math.floor(Math.random() * MOTDs.itsTime.length)];
    if(this.isDday()) return MOTDs.today[Math.floor(Math.random() * MOTDs.today.length)];

    return MOTDs.notNear[Math.floor(Math.random() * MOTDs.notNear.length)]; 
  }

}
