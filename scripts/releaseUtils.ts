import fs from 'node:fs/promises';
import colors from 'picocolors';
import type { Options as ExecaOptions, ResultPromise } from 'execa';
import { execa } from 'execa';

export function run<EO extends ExecaOptions>(
  bin: string,
  args: Readonly<string[]>,
  opts?: Readonly<EO>
): ResultPromise<
  EO & (keyof EO extends 'stdio' ? object : { stdio: 'inherit' })
> {
  return execa(bin, args, { stdio: 'inherit', ...opts }) as never;
}

export async function getLatestTag(): Promise<string> {
  const pkgJson = JSON.parse(await fs.readFile(`package.json`, 'utf-8'));
  return `v${pkgJson.version}`;
}

export async function logRecentCommits(): Promise<void> {
  const tag = await getLatestTag();
  if (!tag) return;
  const sha = await run('git', ['rev-list', '-n', '1', tag], {
    stdio: 'pipe'
  }).then((res) => res.stdout.trim());
  console.log(
    colors.bold(
      `\n${colors.blue(`i`)} Commits since ${colors.green(tag)} ${colors.gray(`(${sha.slice(0, 5)})`)}`
    )
  );
  await run('git', ['--no-pager', 'log', `${sha}..HEAD`, '--oneline', '--'], {
    stdio: 'inherit'
  });
  console.log();
}
