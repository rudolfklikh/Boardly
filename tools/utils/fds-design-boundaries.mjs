const LAYERS = [
  { url: './shared', canUseSelf: true },
  { url: './entities', canUseSelf: true },
  { url: './features', canUseSelf: false },
  { url: './widgets', canUseSelf: false },
  { url: './pages', canUseSelf: false },
  { url: './app', canUseSelf: false }
];
export const FDS_BOUNDARIES_RULES = LAYERS.map(
  ({ url: target, canUseSelf }, i) => {
    const allLayers = LAYERS.slice(canUseSelf ? i + 1 : i).map(
      ({ url }) => url
    );
    return {
      target,
      from: LAYERS.slice(canUseSelf ? i + 1 : i).map(({ url }) => url),
      message: `${target} can't import files from layes: ${allLayers
        .map((url) => {
          const name = url.replace('./', '');
          const app = name.at(0).toUpperCase() + name.substring(1);
          return app;
        })
        .join(', ')}`
    };
  }
);
FDS_BOUNDARIES_RULES.pop();
