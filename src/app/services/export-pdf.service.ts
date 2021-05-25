import { Injectable } from "@angular/core";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const tableHeader = {
  bold: true,
  fontSize: 16,
  color: "black",
};

const tableBody = {
  margin: [0, 5, 0, 15],
};

@Injectable({
  providedIn: "root",
})
export class ExportPdfService {
  constructor() {}

  download(columnNames: string[], columnData: any[], fileName = "export") {
    pdfMake
      .createPdf(this.createTable(columnNames, columnData))
      .download(fileName);
  }

  open(columnNames: string[], columnData: any[]) {
    pdfMake.createPdf(this.createTable(columnNames, columnData)).open();
  }

  private createTable(columnNames: string[], columnData: any[]) {
    return {
      content: {
        table: {
          widths: this.getWidths(columnNames.length),
          headerRows: 1,
          body: this.getBody(columnNames, columnData),
        },
      },
      styles: {
        tableHeader,
        tableBody,
      },
    };
  }

  private getWidths(columns) {
    let widths = [];
    for (let i = 0; i < columns; i++) {
      widths.push("*");
    }
    return widths;
  }

  private getBody(columnNames, columnData) {
    let rows = [];
    let header = [];
    columnNames.map((columnName) =>
      header.push({ text: columnName, style: "tableHeader" })
    );
    rows.push(header);
    let row = [];
    columnData.map((data) => {
      row = [];
      let keys = Object.keys(data);
      keys.forEach((key) => row.push(data[key]));
      rows.push(row);
    });

    return rows;
  }
}
