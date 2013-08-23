var esformatter = require("esformatter");
var diff = require("diff");
var glob = require("glob");
var path = require("path");
var fs = require("fs");

module.exports = function (cwd, config, onStart, onProgress, onEnd) {
	var globOptions = {
		cwd: cwd,
		nosort: true
	};

	// Is there a better way to exclude one folder without nesting?
	glob("**!(node_modules)/*.js", globOptions, function (err, files) {
		if (err) {
			return onEnd(err);
		}
		glob("*.js", globOptions, function (err, rootFiles) {
			if (err) {
				return onEnd(err);
			}

			onStart({
				files: files.length + rootFiles.length
			});
			iterate(files.concat(rootFiles), config, onStart, onProgress, onEnd);
		});
	});
};

function iterate(files, config, onStart, onProgress, onEnd) {
	var file = files.shift();
	if (file) {
		fs.readFile(file, function (err, content) {
			if (err) {
				onProgress(err, file);
			} else {
				onProgress(null, file, differ(file, content.toString(), config));
			}

			iterate(files, config, onStart, onProgress, onEnd);
		});
	} else {
		onEnd(null, totals);
	}
}

var totals = {
	lines: 0,
	changes: 0
};

function differ (file, content, config) {
	var formatted = esformatter.format(content, config);

	var difference = diff.createPatch(file, content, formatted, "Original", "Formatted");
	var difference = diff.diffLines(content, formatted);

	var lines = content.split("\n").length;
	var removedLines = 0;
	var diffBlocks = [];
	for (var i = 0; i < difference.length; i += 1) {
		var portion = difference[i];
		if (portion.removed) {
			removedLines += portion.value.split("\n").length;
			diffBlocks.push({
				original: portion.value,
				formatted: difference[i - 1] && difference[i - 1].added ? difference[i - 1].value : ""
			});
		}
	}

	totals.lines += lines;
	totals.changes += removedLines;

	return {
		lines: lines,
		changes: removedLines,
		diff: diffBlocks
	};
}
