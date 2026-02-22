/* eslint-disable functional/immutable-data */
import {
  generateChangelog,
  release,
  logRecentCommits
} from '@clarchikjs/release-scripts';
import colors from 'picocolors';

release({
  owner: 'rudolfklikh',
  repo: 'Boardly',
  packages: ['Boardly'],
  toTag: (_, version) => `v${version}`,
  logChangelog: () => logRecentCommits(() => '.'),
  getPkgDir: () => '.',
  generateChangelog: async () => {
    console.log(colors.cyan('\nGenerating changelog...'));
    generateChangelog({ getPkgDir: () => '.', tagPrefix: 'v' });
  }
});
