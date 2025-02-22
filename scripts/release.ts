/* eslint-disable functional/immutable-data */
import { release } from '@vitejs/release-scripts';
import colors from 'picocolors';
import { logRecentCommits, run } from './releaseUtils';
import extendCommitHash from './extendCommitHash';

release({
  repo: 'vite',
  packages: ['sdf'],
  toTag: (_, version) => `v${version}`,
  logChangelog: () => logRecentCommits(),
  getPkgDir: () => '.',
  generateChangelog: async () => {
    console.log(colors.cyan('\nGenerating changelog...'));
    const changelogArgs = [
      'conventional-changelog',
      '-p',
      'angular',
      '-i',
      'CHANGELOG.md',
      '-s'
      // '--commit-path',
      // '.'
    ];
    await run('npx', changelogArgs, { cwd: '.' });
    // conventional-changelog generates links with short commit hashes, extend them to full hashes
    // extendCommitHash(`CHANGELOG.md`);
  }
});
