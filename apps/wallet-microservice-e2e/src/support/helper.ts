import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { ArrayMinLength } from '../types/helper';

export function spawnShellCommand(
  command: string,
  extras: SpawnOptionsWithoutStdio
) {
  const parts = command.split(' ') as ArrayMinLength<string, 1>; // eslint-disable-line no-type-assertion/no-type-assertion -- split returns an array of length at least 1
  // if (process.platform === 'win32') {
  //     parts[0] += '.cmd'
  // }
  const options = {
    shell: true,
    ...extras,
  };
  return spawn(parts[0], parts.slice(1), options);
}
