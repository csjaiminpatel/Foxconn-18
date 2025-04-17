import {State, Selector, Action, StateContext, Store} from '@ngxs/store';
import {SetBufferRules, SetBufferRulesError, ResetBufferRules} from './buffer-rules.actions';
import {SupplyVisibilityState} from '../supply-visibility/supply-visibility.state';
import { BufferRulesService } from '../../services/buffer-rules/buffer-rules.service';

export interface BufferRulesStateModel {
  bufferRuleName: string;
}

@State<BufferRulesStateModel>({
  name: 'bufferrules',
  defaults: {
    bufferRuleName: '',
  },
})
export class BufferRulesState {
  constructor(private bufferRulesService: BufferRulesService, private store: Store) {}

  @Selector()
  static getBufferRuleName(state: BufferRulesStateModel) {
    return state.bufferRuleName;
  }

  /**
   * Set Commits from API
   * @param {StateContext<BufferRulesStateModel>} { getState, patchState }
   * @returns
   * @memberof BufferRulesState
   */
  @Action(SetBufferRules)
  async setBufferRules({patchState, dispatch}: StateContext<BufferRulesStateModel>) {
    const parameters = this.store.selectSnapshot(SupplyVisibilityState.getBasicParameters);

    return await this.bufferRulesService.getBufferRules(parameters).subscribe(
      (response: any) => {
        if (response) {
          patchState({bufferRuleName: response.rule});
        }
      },
      (error: any) => {
        dispatch(new SetBufferRulesError(error));
      }
    );
  }

  /**
   * Set Buffer Rules Error
   * @memberof BufferRulesState
   */
  @Action(SetBufferRulesError)
  setBufferRulesError() {}

  /**
   * Reset Buffer Rules
   * @memberof BufferRulesState
   */
  @Action(ResetBufferRules)
  resetBufferRulesError({setState}: StateContext<BufferRulesStateModel>) {
    setState({bufferRuleName: ''});
  }
}
