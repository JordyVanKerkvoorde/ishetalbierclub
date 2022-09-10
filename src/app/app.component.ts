import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { MOTDs } from './data/motd.data';
import { SVGs } from './data/svg.data';
import { GlassTypes } from './domain/glasstypes.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  motd: string;
  svgs = SVGs;
  glassType: GlassTypes;
  backgroundColors = {
    full: "",
    empty: "",
    half: ""
  }


  timespan = interval(1000);
  timer: Subscription;

  cdDaysToBC: number;
  cdHoursToBC: number;
  cdMinutesToBC: number;
  cdSecondsToBC: number;

  totalMsToBC: number;
  maxMsToBC: number = 7*24*60*60*1000;

  beerGifNr: number = 0

  ngOnInit(): void {
    this.motd = this.getMOTD();
    this.glassType = this.getGlassType();
    this.timer = this.timespan.subscribe(x => this.calculateTime())
  }

  ngOnDestroy() {
    this.timer.unsubscribe();
  }

  calculateTime() {
    this.totalMsToBC = this.timeTillBeerClubMS();
    this.setCountDownVariables(this.totalMsToBC);
  }

  timeTillBeerClubMS(): number {
    const bcTime = 17 // 17 o clock
    var now = new Date();
    var tempDate = new Date();
    const nextFriday = new Date(tempDate.setDate(tempDate.getDate()+((7 - tempDate.getDay() + 5) % 7)));
    nextFriday.setHours(bcTime);
    nextFriday.setMinutes(0);
    nextFriday.setSeconds(0);
    nextFriday.setMilliseconds(0);

    if(this.cdSecondsToBC % 10 == 0) {
      this.beerGifNr = this.randomIntFromInterval(0, 10);
      this.motd = this.getMOTD();
    }

    return nextFriday.getTime() - now.getTime();
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

  getGlassType(): GlassTypes {
    if(this.isTime() && this.isDday()) return GlassTypes.FULL;
    if(this.isDday() && !this.timeJustPassed()) return GlassTypes.HALF;

    return GlassTypes.EMPTY;
  }

  setCountDownVariables (ms: number) {
    this.cdDaysToBC = Math.floor(ms / (24*60*60*1000));
    const daysms = ms % (24*60*60*1000);
    this.cdHoursToBC = Math.floor(daysms / (60*60*1000));
    const hoursms = ms % (60*60*1000);
    this.cdMinutesToBC = Math.floor(hoursms / (60*1000));
    const minutesms = ms % (60*1000);
    this.cdSecondsToBC = Math.floor(minutesms / 1000);
  }

  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
}
