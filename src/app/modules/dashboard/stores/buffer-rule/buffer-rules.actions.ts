export class SetBufferRules {
  static readonly type = '[Bufferrules] Set Buffer Rules';
}

export class SetBufferRulesError {
  static readonly type = '[Bufferrules] Set Buffer Rules Error';
  constructor(public readonly error: any) {}
}

export class ResetBufferRules {
  static readonly type = '[Bufferrules] Reset Buffer Rules';
}
