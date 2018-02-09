# iA-Writer-Templates-Dev

Preview and create your own templates for iA Writer with ease.

## Requirements

* [Node.js][node]
* [Gulp][gulp] - `npm install --global gulp-cli`

## Setup

1. Clone or download this repository.
2. Navigate to the repository in your Terminal.
3. Run `npm install` to install dependencies.
4. Run `gulp` to start the development server

## Development

Put your template bundles in `src/templates` and rename `style.css` to `style.scss`.

The styles are parsed by [SASS][sass] and [PostCSS Autoprefixer][autoprefixer]. This allows to write CSS without relying on vendor prefixes.

SCSS allows importing additional and shared files. For example a `_typography.scss` placed in `src/styles` could be imported by writing `@import '../../../../styles/typography';` inside the `style.scss` in a template bundle, which is useful if you plan to create multiple bundles sharing some code.

Sample content can be put into `src/content`, one Markdown file per template bundle. Make sure the names match. Since this project can't use the same Markdown engine that iA Writer uses, the rendered Markdown is only an estimate. If something looks off or is not supported check your bundle in iA Writer. It is not planned to reimplement the exact rendering.

## Output

Output is stored in the `dist` folder.

## Notes

Since CSS is not quite made for print, please keep in mind that A4 (210mm by 297mm) roughly translates to 596 by 842 px. The demo pages contain CSS which adds this height as a min-height to the body.

## Credits

* Kristina for the idea

## Author

* [Florian Pichler][pichfl] <mailto:fp@ylk.gd>

[node]: https://nodejs.org
[gulp]: https://gulpjs.com
[sass]: http://sass-lang.com
[autoprefixer]: https://github.com/postcss/autoprefixer
[pichfl]: https://florianpichler.de
