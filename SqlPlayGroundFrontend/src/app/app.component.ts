import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { EditorView, basicSetup } from "codemirror";
import { PostgreSQL, sql } from "@codemirror/lang-sql";
import { autocompletion } from "@codemirror/autocomplete";
import { oneDark, color } from "@codemirror/theme-one-dark"
import { AppService } from './app.service';


@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'SqlPlayGroundFrontend';
  editorView: EditorView | undefined;
  @ViewChild("editor", { static: true }) editorRef!: ElementRef;

  constructor(private appService: AppService) { }

  ngAfterViewInit() {
    console.log(this.editorRef);
    (this.editorRef.nativeElement as HTMLElement).addEventListener("keydown", (event) => {
      event.preventDefault();
      if (event.altKey) {
        switch (event.key) {
          case "s":
            this.onSave();
            break;
          case "Enter":
            console.log("Alt + Enter");
            this.onRunQuery();
        }
      }
    })
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
      doc: 'SELECT NOW();',
      extensions: [
        oneDark,
        basicSetup,
        autocompletion(),
        sql({ dialect: PostgreSQL, upperCaseKeywords: true }),
        editorStyles,
      ],
    })

  }

  onRunQuery() {
    const query = this.editorView?.state.doc.toString();
    if (!query) {

    } else {
      this.appService.handelQueryRun(query).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }

  onSave() {

  }
}
