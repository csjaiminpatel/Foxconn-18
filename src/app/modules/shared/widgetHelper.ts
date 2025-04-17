import { PanelCache } from "../dashboard/models/sv-dashboard";


interface LooseObject {
  [key: string]: any;
}
export class widgetHelper {
  /**
   * Set Widget Cached Values
   */
  public static getFormattedSettings(panelCache: PanelCache[]) {
    const widgetCache: LooseObject = {};
    panelCache.forEach((cache) => {
      widgetCache[cache.key] = cache.value;
    });
    return widgetCache;
  }

  public static getSettingsWithSort(selectedSort:any, panelCache?:PanelCache[]): PanelCache[] {
    const sortObject = {key: 'sort', value: selectedSort};

    if (panelCache) {
      const index = panelCache.findIndex((e) => {
        return e.key == 'sort';
      });

      if (index != -1) {
        panelCache[index] = sortObject;
      } else {
        panelCache.push(sortObject);
      }
    } else {
      panelCache = [sortObject];
    }
    return panelCache;
  }
}
