import { ProcedureSchema, API } from '@tw/api';

type CombineKeysWithSeparator<K1, K2> = `${K1 & string}.${K2 & string}`;

type AllPathToPatternInObject<
  Obj,
  Pattern,
  Keys = keyof Obj
> = Keys extends keyof Obj
  ? Obj[Keys] extends Pattern
    ? Keys
    : CombineKeysWithSeparator<
        Keys,
        AllPathToPatternInObject<Obj[Keys], Pattern>
      >
  : never;

export type ApiProcedurePaths = AllPathToPatternInObject<API, ProcedureSchema>;

// type func = <
//   TKeys extends AllPathToPatternInObject<typeof aa, { [key: string]: any }>
// >(
//   key: TKeys
// ) => void;
// // eslint-disable-next-line @typescript-eslint/no-empty-function
// const fff: func = (key) => {};
// fff('b');
