const through = require('through2');
const path = require('path');
const { JSDOM } = require('jsdom');
const { parse: plistParse } = require('fast-plist');
const Vinyl = require('vinyl');
const Handlebars = require('handlebars');
const fs = require('fs');
const Remarkable = require('remarkable');

module.exports = function renderIawritertemplate() {
	const demoIndexFile = fs.readFileSync('./lib/templates/demo/index.hbs', { encoding: 'utf-8' });
	const demoIndex = Handlebars.compile(demoIndexFile);
	const demoTemplateFile = fs.readFileSync('./lib/templates/demo/template.hbs', {
		encoding: 'utf-8',
	});
	const demoTemplate = Handlebars.compile(demoTemplateFile);
	const md = new Remarkable();

	const templates = {};

	return through.obj(
		function transform(file, enc, cb) {
			const [, fileName] = file.relative.split(path.sep);
			const ext = path.extname(fileName);
			const templateName = fileName.replace(ext, '');

			templates[templateName] = templates[templateName] || { partials: [], ext };

			if (file.extname === '.html') {
				const dom = new JSDOM(file.contents, { runScripts: 'dangerously' });

				templates[templateName].partials.push({
					name: file.stem,
					html: dom.window.document.body.innerHTML,
					className: dom.window.document.body.className,
					hasDocument: dom.window.document.body.dataset.document !== undefined,
				});
			}

			if (file.extname === '.plist') {
				templates[templateName].config = plistParse(file.contents.toString());
				templates[templateName].fileName = fileName;
			}

			if (file.extname === '.md') {
				templates[templateName].contents = md.render(file.contents.toString());
			}

			cb();
		},
		function flush(cb) {
			Object.entries(templates).forEach(([templateName, template]) => {
				const htmlPartials = template.partials.reduce((acc, partial) => {
					acc[partial.name] = partial;

					return acc;
				}, {});

				const partials = Object.entries(template.config).reduce((acc, [key, value]) => {
					if (key.match(/^IATemplate/)) {
						acc[key] = htmlPartials[value];
					}

					return acc;
				}, {});

				const contents = {
					templateName,
					templateFileName: template.fileName,
					config: template.config,
					partials,
					contents: template.contents,
				};

				const file = new Vinyl({
					path: `${templateName}.html`,
					contents: new Buffer(demoTemplate(contents)),
				});

				this.push(file);
			});

			const index = new Vinyl({
				path: 'index.html',
				contents: new Buffer(
					demoIndex({
						templates,
					})
				),
			});

			this.push(index);

			cb();
		}
	);
};
