import {Injectable, ElementRef} from '@angular/core';
import * as FileSaver from 'file-saver';
import moment from 'moment';
import * as XLSX from 'xlsx';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
const CSV_TYPE = 'text/csv;charset=utf-8';
const CSV_EXTENSION = '.csv';
const PDF_TYPE = 'text/pdf;charset=utf-8';
const PDF_EXTENSION = '.pdf';
const XML_TYPE = 'text/xml;charset=utf-8';
const XML_EXTENSION = '.xml';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor() {}

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = {
      Sheets: {data: worksheet},
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  public exportTableAsExcelFile(elementName: ElementRef, excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(elementName);
    console.log('worksheet', worksheet);
    const workbook: XLSX.WorkBook = {
      Sheets: {data: worksheet},
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }
  public saveAsExcelFile(buffer: any, fileName: string, keep = false): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    const time = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    FileSaver.saveAs(data, fileName + (keep === false ? '_export_' + time : '') + EXCEL_EXTENSION);
  }

  public saveAsCSVFile(data: any, fileName: string) {
    const blob: Blob = new Blob([data], {
      type: CSV_TYPE,
    });
    const time = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    FileSaver.saveAs(data, fileName + '_export_' + time + CSV_EXTENSION, {
      autoBom: true,
    });
    // FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + CSV_EXTENSION, { autoBom: true });
  }

  public saveAsPDFFile(data: any, fileName: any) {
    const blob: Blob = new Blob([data], {
      type: PDF_TYPE,
    });

    FileSaver.saveAs(data, fileName + PDF_EXTENSION, {
      autoBom: true,
    });
  }
  public saveAsXmlFile(data: any, fileName: any) {
    const blob: Blob = new Blob([data], {
      type: XML_TYPE,
    });

    FileSaver.saveAs(data, fileName + XML_EXTENSION, {
      autoBom: true,
    });
  }

  public saveAsZipFileWithTime(data: any, fileName: any) {
    const blob: Blob = new Blob([data], {
      type: 'application/zip',
    });
    const time = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    FileSaver.saveAs(data, fileName + '_export_' + time + '.zip', {
      autoBom: true,
    });
  }

  public saveAsXmlFileWithTime(data: any, fileName: any) {
    const blob: Blob = new Blob([data], {
      type: 'text/xml',
    });
    const time = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');
    FileSaver.saveAs(data, fileName + '_export_' + time + '.xml', {
      autoBom: true,
    });
  }
}

