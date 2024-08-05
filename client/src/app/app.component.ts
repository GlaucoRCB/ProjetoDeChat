import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MaterialModule } from './material.module';
import { FormsModule } from '@angular/forms';
import { SocketIoService } from './socket-io.service';
import { Message } from './messege';
import { Subscription } from 'rxjs';
import { NgFor } from '@angular/common';
import { MatList, MatListItem } from '@angular/material/list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgFor,
    RouterOutlet,
    MaterialModule,
    FormsModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  nickname!: string;
  message!: string;
  messages: Message[] = [];
  private subscriptionMessages!: Subscription;
  private subscriptionList!: Subscription;

  @ViewChild(MatList, {read: ElementRef, static: true}) list!: ElementRef;
  @ViewChildren(MatListItem) listItems!: QueryList<MatListItem>;

  constructor(private socketService: SocketIoService) {

  }

  ngOnInit() {
    this.subscriptionMessages = this.socketService.messages()
    .subscribe((m: Message)=>{
      console.log(m);
      this.messages.push(m);
    });
  }

  ngAfterViewInit() {
    this.subscriptionList = this.listItems.changes.subscribe((e)=> {
      this.list.nativeElement.scrollTop = this.list.nativeElement.scrollHeight;
      //console.log(this.list.nativeElement.scrollHeight);
    });
  }

  send() {
    this.socketService.send({
      from: this.nickname,
      message: this.message
    });
    this.message = '';
  }

  ngOnDestroy() {
    this.subscriptionMessages.unsubscribe();
    this.subscriptionList.unsubscribe();
  }
}
