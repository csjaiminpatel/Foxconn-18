import {StringLengthRule} from 'devextreme/ui/validation_rules';

export enum EnumConditionType {
  ROW = 0,
  CONDITIONAL = 1,
  LEADTIME = 2,
  CONDITIONAL_LEADTIME = 3,
  EXCEL_FORMULA = 4,
}
export enum EnumCalculationLineType {
  SINGLE_VALUE = 0,
  MULTI_VALUES = 5,
}
export class CalculationLineConditionalFormats {
  id?: string | number;
  dateCreated?: Date;
  dateModified?: Date;
  createdBy?: string;
  modifiedBy?: string;
  lineIdentification?: string;
  formatting?: string;
  calculation?: string;

  backgroundColor?: string; //new one
  borderColor?: string; //new one
  operator?: string; //new one
  textColor?: string; //new one, this one is unused
  value?: string; //new one
  type?: string; //new one

  format?: string;

  order?: number;
  formattingStyle$?: FormatStyle$;
  borderWidth?: string;
  valueConditional?: any;
  operatorConditional?: string;
  valueLeadTime?: any;
  operatorLeadTime?: string;
  logicalOperator?: string;
  static setFormatting(record: CalculationLineConditionalFormats, lineName: string) {
    record.formatting = JSON.stringify(record.formattingStyle$);
    record.backgroundColor = record.formattingStyle$?.backgroundClass;
    record.borderColor = record.formattingStyle$?.borderClass;
    record.borderWidth = record.formattingStyle$?.borderWidth;
    record.textColor = record.formattingStyle$?.backgroundClass;
    record.operator = record.formattingStyle$?.operator;
    record.value = record.formattingStyle$?.value;
    if(record.formattingStyle$?.type === EnumConditionType.EXCEL_FORMULA){
      record.type = "EXCELFUNCTION";
    } else {
      record.type = record.formattingStyle$?.type
        ? record.formattingStyle$.type.toString()
        : EnumConditionType.ROW.toString();
    }

    record.valueConditional = record.formattingStyle$?.valueConditional;
    record.operatorConditional = record.formattingStyle$?.operatorConditional;
    record.valueLeadTime = record.formattingStyle$?.valueLeadTime;
    record.operatorLeadTime = record.formattingStyle$?.operatorLeadTime;
    record.logicalOperator = record.formattingStyle$?.logicalOperator;
    if (record.formattingStyle$?.type === EnumConditionType.CONDITIONAL) {
      lineName = 'x';
      record.calculation = `${lineName} ${record.formattingStyle$.operator} ${record.formattingStyle$.value}`;
    } else if (record.formattingStyle$?.type === EnumConditionType.LEADTIME) {
      lineName = 'SV_seq';
      record.calculation = `${lineName} ${record.formattingStyle$.operator} ${record.formattingStyle$.value}`;
    } else if (record.formattingStyle$?.type === EnumConditionType.CONDITIONAL_LEADTIME) {
      lineName = 'x';
      const lineName1 = 'SV_seq';
      record.calculation =
        `${lineName} ${record.formattingStyle$.operatorConditional} ${record.formattingStyle$.valueConditional} ` +
        `${record.formattingStyle$.logicalOperator} ` +
        `${lineName1} ${record.formattingStyle$.operatorLeadTime} ${record.formattingStyle$.valueLeadTime}`;
    } else if(record.formattingStyle$?.type === EnumConditionType.EXCEL_FORMULA) {
      record.calculation = record.calculation;
    }
    else {
      record.calculation = '1=1';
    }
  }
  static setFormatting$(record: CalculationLineConditionalFormats) {
    if (record.type && parseInt(record.type) == EnumConditionType.CONDITIONAL_LEADTIME) {
      record.formattingStyle$ = {
        backgroundClass: record.backgroundColor,
        borderClass: record.borderColor,
        borderWidth: record.borderWidth,
        type: parseInt(record.type),
        visible$: false,

        valueConditional: record.valueConditional,
        operatorConditional: record.operatorConditional || '=',
        valueLeadTime: record.valueLeadTime,
        operatorLeadTime: record.operatorLeadTime || '=',
        logicalOperator: record.logicalOperator || 'AND',
      } as FormatStyle$;
    } else {
      record.formattingStyle$ = {
        backgroundClass: record.backgroundColor,
        borderClass: record.borderColor,
        borderWidth: record.borderWidth,
        value: record.value,
        type: record.type  ? record.type == 'EXCELFUNCTION' ? EnumConditionType.EXCEL_FORMULA : parseInt(record.type) : EnumConditionType.ROW,
        visible$: false,
        operator: record.operator || '=',
      } as FormatStyle$;
    }
  }
}
export class FormatStyle$ {
  static getNextOperator(operatorList: string[], operator: string): any {
    const index = operatorList.findIndex((c) => c === operator);
    if (index < 0 || index === operatorList.length - 1) {
      return operatorList[0];
    } else {
      return operatorList[index + 1];
    }
  }
  backgroundClass?: string;
  borderClass?: string;
  borderWidth?: string;
  operator?: string; //operator will be $ for row type
  value: any;
  calculation : any;
  type = EnumConditionType.ROW;
  visible$ = false;
  valueConditional?: any;
  operatorConditional?: string;
  valueLeadTime?: any;
  operatorLeadTime?: string;
  logicalOperator?: string;
  public static getOperatorsList(): string[] {
    const list = ['=', '>', '>=', '<', '<='];
    return list;
  }
  public static readonly DEFAULT_BG = 'bg-white';
  public static readonly DEFAULT_BORDER = 'border-white';
  public static readonly DEFAULT_STYLE = 'white';
  public static readonly DEFAULT_BORDER_WIDTH = 'medium';
  public static readonly DEFAULT_BORDER_COLOR = 'gray';

  public static getBGClassList(): string[] {
    const list = [
      this.DEFAULT_BG,
      'bg-yellow',
      'bg-purple',
      'bg-gray',
      'bg-orange',
      'bg-maroon',
      'bg-green',
    ];
    return list;
  }
  public static getBorderClassList(): string[] {
    const list = [
      this.DEFAULT_BORDER,
      'border-gray',
      'border-yellow',
      'border-purple',
      'border-maroon',
      'border-green',
      'border-orange',
      'border-none',
    ];
    return list;
  }
  public static getStyleRadioList(): string[] {
    const list = [
      'white',
      'gray',
      'yellow',
      'purple',
      'maroon',
      'green',
      'orange',
      'lavender',
      'bright_orange',
      'yellow_green',
      'white_maroon',
      'white_grey',
      'bright-orange_maroon',
      'yellow_maroon',
      'yellow-green_maroon',
      'violet',
      'dark-blue',
      'cyan',
      'cyan_magenta',
      'light-blue_black',
      'light-blue_red',
    ];
    return list;
  }
  public static getColorRadioListForWidget(): string[] {
    const list = ['gray', 'yellow', 'purple', 'maroon', 'green', 'orange', 'none'];
    return list;
  }
  public static getRoundTypeList(): any {
    const list = [
      {name: 'Round', value: '0'},
      {name: ' Up ⏶', value: '1'},
      {name: ' Down ⏷', value: '2'},
    ];
    return list;
  }
  public static getRoundDigitsList(): any {
    const list = [
      {name: 'N/A - No rounding', value: '0'},
      {name: '1 digits', value: '1'},
      {name: '2 digits', value: '2'},
      {name: '3 digits', value: '3'},
      {name: '4 digits', value: '4'},
      {name: '5 digits', value: '5'},
      {name: '6 digits', value: '6'},
      {name: '7 digits', value: '7'},
      {name: '8 digits', value: '8'},
      {name: '9 digits', value: '9'},
      {name: '10 digits', value: '10'},
    ];

    return list;
  }
  public static getBorderWidthRadioList(): any[] {
    const list = ['small', 'medium', 'large'];
    return list;
  }
}
