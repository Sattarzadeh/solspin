import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { ArrayMinLength } from '../types/helper';

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
