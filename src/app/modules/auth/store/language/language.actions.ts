import { AppConfigLanguageItem } from "../../models/auth.model";

export class SetLanguage {
  static readonly type = '[Language] SetLanguage';
  constructor(public readonly language:string ) {}
}

export class SetupLanguage {
  static readonly type = '[Language] SetupLanguage';
  constructor(public readonly languages: AppConfigLanguageItem[], public readonly defaultLang: AppConfigLanguageItem) {}
}
