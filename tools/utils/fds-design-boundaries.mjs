const LAYERS = [
  { url: './shared', canUseSelf: true },
  { url: './entities', canUseSelf: true },
  { url: './features', canUseSelf: false },
  { url: './widgets', canUseSelf: false },
  { url: './pages', canUseSelf: false },
  { url: './app', canUseSelf: false }
];
export const FDS_BOUNDARIES_RULES = LAYERS.map(
  ({ url: target, canUseSelf }, i) => ({
    target,
    from: LAYERS.slice(canUseSelf ? i + 1 : i).map(({ url }) => url)
  })
);
FDS_BOUNDARIES_RULES.pop();
