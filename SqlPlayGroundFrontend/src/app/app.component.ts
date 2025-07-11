import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {EditorView, basicSetup} from "codemirror";
import {PostgreSQL, sql} from "@codemirror/lang-sql";
import {autocompletion} from "@codemirror/autocomplete";

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'SqlPlayGroundFrontend';
  editorView:EditorView | undefined;
  @ViewChild("editor",{static:true}) editorRef!: ElementRef;
  ngAfterViewInit(){
    console.log(this.editorRef);
    const editorStyles = EditorView.theme({
      "&": {
        height: "100%",
      },
      "& .cm-scroller": {
        overflow: "auto"
      } 
    })
    this.editorView = new EditorView({
      parent: this.editorRef.nativeElement,
      doc:'SELECT NOW();',
      extensions: [basicSetup, autocompletion(), sql({dialect:PostgreSQL, upperCaseKeywords:true}),editorStyles],
    })
    
  }

  onRunQuery() {
    console.log(this.editorView?.state.doc.toString());
  }

  onSave() {

  }
}
