export const importThemes = async () => {
  const themeFiles = {
    active4d: await import("monaco-themes/themes/Active4D.json"),
    "all-hallows-eve": await import(
      "monaco-themes/themes/All Hallows Eve.json"
    ),
    amy: await import("monaco-themes/themes/Amy.json"),
    "birds-of-paradise": await import(
      "monaco-themes/themes/Birds of Paradise.json"
    ),
    blackboard: await import("monaco-themes/themes/Blackboard.json"),
    "brilliance-black": await import(
      "monaco-themes/themes/Brilliance Black.json"
    ),
    "brilliance-dull": await import(
      "monaco-themes/themes/Brilliance Dull.json"
    ),
    "chrome-devtools": await import(
      "monaco-themes/themes/Chrome DevTools.json"
    ),
    "clouds-midnight": await import(
      "monaco-themes/themes/Clouds Midnight.json"
    ),
    clouds: await import("monaco-themes/themes/Clouds.json"),
    cobalt: await import("monaco-themes/themes/Cobalt.json"),
    cobalt2: await import("monaco-themes/themes/Cobalt2.json"),
    dawn: await import("monaco-themes/themes/Dawn.json"),
    dracula: await import("monaco-themes/themes/Dracula.json"),
    dreamweaver: await import("monaco-themes/themes/Dreamweaver.json"),
    eiffel: await import("monaco-themes/themes/Eiffel.json"),
    "espresso-libre": await import("monaco-themes/themes/Espresso Libre.json"),
    "github-dark": await import("monaco-themes/themes/GitHub Dark.json"),
    "github-light": await import("monaco-themes/themes/GitHub.json"),
    github: await import("monaco-themes/themes/GitHub.json"),
    idle: await import("monaco-themes/themes/IDLE.json"),
    katzenmilch: await import("monaco-themes/themes/Katzenmilch.json"),
    "kuroir-theme": await import("monaco-themes/themes/Kuroir Theme.json"),
    lazy: await import("monaco-themes/themes/LAZY.json"),
    "magicwb--amiga-": await import(
      "monaco-themes/themes/MagicWB (Amiga).json"
    ),
    "merbivore-soft": await import("monaco-themes/themes/Merbivore Soft.json"),
    merbivore: await import("monaco-themes/themes/Merbivore.json"),
    "monokai-bright": await import("monaco-themes/themes/Monokai Bright.json"),
    monokai: await import("monaco-themes/themes/Monokai.json"),
    "night-owl": await import("monaco-themes/themes/Night Owl.json"),
    nord: await import("monaco-themes/themes/Nord.json"),
    "oceanic-next": await import("monaco-themes/themes/Oceanic Next.json"),
    "pastels-on-dark": await import(
      "monaco-themes/themes/Pastels on Dark.json"
    ),
    "slush-and-poppies": await import(
      "monaco-themes/themes/Slush and Poppies.json"
    ),
    "solarized-dark": await import("monaco-themes/themes/Solarized-dark.json"),
    "solarized-light": await import(
      "monaco-themes/themes/Solarized-light.json"
    ),
    spacecadet: await import("monaco-themes/themes/SpaceCadet.json"),
    sunburst: await import("monaco-themes/themes/Sunburst.json"),
    "textmate--mac-classic-": await import(
      "monaco-themes/themes/Textmate (Mac Classic).json"
    ),
    "tomorrow-night-blue": await import(
      "monaco-themes/themes/Tomorrow-Night-Blue.json"
    ),
    "tomorrow-night-bright": await import(
      "monaco-themes/themes/Tomorrow-Night-Bright.json"
    ),
    "tomorrow-night-eighties": await import(
      "monaco-themes/themes/Tomorrow-Night-Eighties.json"
    ),
    "tomorrow-night": await import("monaco-themes/themes/Tomorrow-Night.json"),
    tomorrow: await import("monaco-themes/themes/Tomorrow.json"),
    twilight: await import("monaco-themes/themes/Twilight.json"),
    "upstream-sunburst": await import(
      "monaco-themes/themes/Upstream Sunburst.json"
    ),
    "vibrant-ink": await import("monaco-themes/themes/Vibrant Ink.json"),
    "xcode-default": await import("monaco-themes/themes/Xcode_default.json"),
    zenburnesque: await import("monaco-themes/themes/Zenburnesque.json"),
  };

  const themes = {};
  for (const [key, module] of Object.entries(themeFiles)) {
    themes[key] = module.default;
  }
  return themes;
};
