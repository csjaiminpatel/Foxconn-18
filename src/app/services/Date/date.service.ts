import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import { Commit } from "../../modules/dashboard/models/supply-visibility.model";

@Injectable({
  providedIn: 'root',
})

export class DateService {

  constructor(private readonly datePipe: DatePipe) { }

  /**
   * Get the month names
   */
  get monthNames(): { [key: string]: string[] } {
    return {
      en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      enFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      cs: ['Led.', 'Úno.', 'Bře.', 'Dub.', 'Kvě.', 'Čvn.', 'Čvc.', 'Srp.', 'Zář.', 'Říj.', 'Lis.', 'Pro.'],
      csFull: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec']
    };
  }

  /**
   * Get the invalid dates
   * These dates are not valid and should not be displayed, add more if needed
   */
  get invalidDates() {
    return ['2000-01-01', '0001-01-01', '1899-12-31', '1900-01-01', '0000-00-00'];
  }

  /**
   * Get the date in the correct language
   * @param date
   * @param language
   */
  getDate(date: string, language = 'en') {
    return this.customFormat(date, ['cs', 'cz'].includes(language) ? 'dd.MM.yyyy' : 'yyyy-MM-dd');
  }

  /**
   * Get the date with year in the correct language
   * @param date
   * @param language
   */
  getDateWithYear(date: string | number | Date, language = 'en') {
    const months = this.getMonths(language);
    const newDate = new Date(date);
    return months[newDate.getMonth()] + ' ' + newDate.getDate() + ' ' + newDate.getFullYear();
  }

  /**
   * Get the date and time in the correct language
   * @param date
   * @param language
   */
  getDateTime(date?: string, language = 'en') {
    return this.customFormat(date, ['cs', 'cz'].includes(language) ? 'dd.MM.yyyy HH:mm' : 'yyyy-MM-dd HH:mm');
  }

  /**
   * Get the months in the correct language
   * @param language
   * @param short - if true, return short month names
   */
  getMonths(language: string, short = true) {
    const lengthVersion = short ? '' : 'Full';
    return this.monthNames[(['cs', 'cz'].includes(language.toLowerCase()) ? 'cs' : 'en') + lengthVersion];
  }

  /**
   * Format date with custom format and check if the date is invalid (e.g. 0001-01-01)
   * @param value
   * @param format
   */
  customFormat(value?: string, format: string = 'yyyy-MM-dd') {
    if (!value) {
      return '';
    }
    const datePart = value.substring(0, 10);
    if (this.invalidDates.includes(datePart)) {
      return '';
    }
    return this.datePipe.transform(value, format);
  }

  /**
   * Get the date in the correct language based on user's locale
   * @param date
   */
  getLocaleDate(date: string) {
    return new Date(date).toLocaleDateString();
  }

  /**
   * Get the date and time in the correct language based on user's locale
   * @param date
   */
  getLocaleDateTime(date: string) {
    return new Date(date).toLocaleString();
  }

  /**
   * Get the time in the correct language based on user's locale
   * @param date
   */
  getLocaleTime(date: string) {
    return new Date(date).toLocaleTimeString();
  }

  /**
   * Compare two dates
   * @param date1
   * @param date2
   * @returns boolean if date1 is greater than date2
   */
  compareDates(date1: string, date2: string) {
    return new Date(date1) > new Date(date2);
  }

  /**
   * Compare two dates and check if they are equal
   * @param date1
   * @param date2
   */
  compareDatesEqual(date1: string, date2: string) {
    return new Date(date1).toDateString() === new Date(date2).toDateString();
  }

  /**
   * Get dates for commit history table
   * @param commit
   */
  commitHistoryTableDates(commit: any): Commit { //TODO: set DummyCommitDetail to commit DTO jaimin
    const datesList = [
      { field: 'actualETADate', format: undefined },
      { field: 'deliveryDate', format: undefined },
      { field: 'eddDate', format: undefined },
      { field: 'etaDate', format: undefined },
      { field: 'etaPortDate', format: undefined },
      { field: 'etdDate', format: undefined },
      { field: 'expirationDate', format: undefined },
      { field: 'inboundDeliveryDate', format: undefined },
      { field: 'receiveDate', format: 'yyyy-MM-dd HH:mm:ss' },
      { field: 'recomitRequestDate', format: undefined },
      { field: 'scheduleLineDate', format: undefined },
      { field: 'slotDate', format: 'yyyy-MM-dd HH:mm:ss' },
      { field: 'requestDate', format: undefined },
      { field: 'triggerDate', format: undefined },
      { field: 'instructionEtaDate', format: undefined },
      { field: 'purchasingDocumentDate', format: undefined },
      { field: 'otmReceivedDate', format: undefined },
      { field: 'sapDeliveryDate', format: undefined },
      { field: 'lastUpdateDate', format: 'yyyy-MM-dd HH:mm:ss' },
      { field: 'codeDate', format: undefined },
      { field: 'arrivalDate', format: 'yyyy-MM-dd HH:mm:ss' },
      { field: 'createDate', format: 'yyyy-MM-dd' },
    ];
    for (const element of datesList) {
      if (commit[element.field] && commit[element.field].trim() !== '') {
        commit[element.field] = element.format
          ? this.customFormat(commit[element.field], element.format)
          : this.getDate(commit[element.field]);
      }
    }
    return commit;
  }

  /**
   * Get the forecast date in the format YYYY-MM-DD HH:mm
   * @param date
   */
  getForecastDate(date: string) {
    const dateTime = this.getDateTime(date);
    const [datePart, timePart] = dateTime ? dateTime.split(' ') : ['', ''];
    return [datePart, [timePart]];
  }
}
