export type TupleOfLength<
  T,
  N extends number,
  Acc extends T[] = []
> = Acc['length'] extends N ? Acc : TupleOfLength<T, N, [...Acc, T]>;
export type ArrayMinLength<T, N extends number> = [
  ...TupleOfLength<T, N>,
  ...T[]
];
