import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {EditorView, minimalSetup} from "codemirror"

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SqlPlayGroundFrontend';
  @ViewChild("editor",{static:true}) editorRef!: ElementRef;
  ngAfterViewInit(){
    console.log(this.editorRef);
  }
}
