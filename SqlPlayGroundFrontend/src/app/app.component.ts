import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { EditorView, basicSetup } from "codemirror";
import { PostgreSQL, sql } from "@codemirror/lang-sql";
import { autocompletion } from "@codemirror/autocomplete";
import { oneDark, color } from "@codemirror/theme-one-dark"
import { AppService } from './app.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'SqlPlayGroundFrontend';
  queryResultRows: any[] = [];
  tableColumns: string[] = [];
  queryResultString: string = "";
  queryErrorResponse: string = ""
  editorView: EditorView | undefined;
  @ViewChild("editor", { static: true }) editorRef!: ElementRef;

  constructor(private appService: AppService) { }
  ngOnInit(): void {
    this.appService.sendProvisionRequest().subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  ngAfterViewInit() {
    (this.editorRef.nativeElement as HTMLElement).addEventListener("keydown", (event) => {
      if (event.altKey) {
        switch (event.key) {
          case "s":
            this.onSave();
            break;
          case "Enter":
            event.preventDefault();
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
    this.queryResultString = "";
    this.queryErrorResponse = "";
    this.queryResultRows = [];
    this.tableColumns = [];
    const query = this.editorView?.state.doc.toString();
    if (!query) {
      return;
    }
    this.appService.handelQueryRun(query).subscribe({
      next: (res) => {
        if(res.count !== 0 && res.rows.length){
          this.tableColumns = Object.keys(res.rows[0]);
          this.queryResultRows = res.rows;
        }else {
          this.queryResultString = res.command && `${res.command} runes successfully`
        }
      },
      error: (err: HttpErrorResponse) => {
        // this.queryResultString = err.error.message;
        this.queryErrorResponse = err.error.message;
      }
    })
  }

  onSave() {

  }
}
