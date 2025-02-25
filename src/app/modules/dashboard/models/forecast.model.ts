import { BasicParameters } from './supply-visibility.model';

export interface Forecast {
  plant: string;
  partNumber: string;
  vendorCode: string;
  materialManagementViewID: string;
  weeks?: number;
  days?: number;
  records?: number;
  variant?: string;
  reviewed?: Reviewed;
  staticvalues: any[];
  projectionDetails: ForecastDetail[];
  mergeProjections?: any[];
}

export interface ForecastDetail {
  // firstDateOfWeek: string;
  date: string;
  label: string;
  week: number;
  projectionWeek: number;
  values: any[];
  sequence: number;
}

export interface ForecastVirtualVc {
  data: Forecast;
  basicParameters: BasicParameters;
  validQuota: boolean;
}

export interface Reviewed {
  partNumber: string;
  vendorCode: string;
  validity: number;
  dateCreated: string;
  dateModified?: string;
  createdBy?: string;
  modifiedBy?: string;
}

export interface ForecastTable {
  // firstDateOfWeek: any;
  date: any;
  week: any;
  bufferQty: any;
  forecastQty: any;
  commitQty: any;
  usageQty: any;
  projectionToForecast: any;
  wos: any;
}

export interface ForecastWeekRange {
  startWeek?: number;
  endWeek?: number;
}

export interface ForecastDate {
  date: string;
}

export interface RangeData {
  start: number;
  end: number;
  value: number[];
}
