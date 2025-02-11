import {State, Selector, StateContext, Action} from '@ngxs/store';
import {SetupLanguage, SetLanguage} from './language.actions';

export interface LanguageStateModel {
  defaultLang: string;
  languages: string[];
  currentLang: any;
}

@State<LanguageStateModel>({
  name: 'language',
  defaults: {
    defaultLang: 'en',
    languages: ['en', 'cz'],
    currentLang: 'en',
  },
})
export class LanguageState {
  @Selector()
  static getLangs({languages}: LanguageStateModel) {
    return languages;
  }

  @Selector()
  static getCurrentLang({currentLang}: LanguageStateModel) {
    return currentLang;
  }

  @Selector()
  static getDefaultLang({defaultLang}: LanguageStateModel) {
    return defaultLang;
  }
  @Action(SetupLanguage)
  setupLang(
    { setState }: StateContext<LanguageStateModel>,
    { languages, defaultLang }: SetupLanguage
  ) {
    if (!languages || languages.length === 0) {
      console.error('Languages array is empty or undefined!');
      return;
    }

    setState({
      languages: languages.map((lang) => lang.language) ?? ['en'], // Fallback to default
      currentLang: defaultLang?.language ?? 'en', // Ensure defaultLang is not undefined
      defaultLang: defaultLang?.language ?? 'en',
    });
  }

  @Action(SetLanguage)
  setLang(
    { patchState }: StateContext<LanguageStateModel>,
    { language }: SetLanguage
  ) {
    console.log('Setting language to:', language);
    if (!language) {
      console.error('Trying to set an undefined language!');
      return;
    }
    patchState({
      currentLang: language,
    });
  }
}
