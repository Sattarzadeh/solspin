import { spawn, SpawnOptionsWithoutStdio } from 'child_process';

export function spawnShellCommand(
  command: string,
  extras: SpawnOptionsWithoutStdio
) {
  const parts = command.split(' ') as ArrayMinLength<string, 1>;
  const options = {
    shell: true,
    ...extras,
  };
  return spawn(parts[0], parts.slice(1), options);
}

export type TupleOfLength<
  T,
  N extends number,
  Acc extends T[] = []
> = Acc['length'] extends N ? Acc : TupleOfLength<T, N, [...Acc, T]>;
export type ArrayMinLength<T, N extends number> = [
  ...TupleOfLength<T, N>,
  ...T[]
];
