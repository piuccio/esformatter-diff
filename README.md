# EsFormatter Diff

If you have already a large code base and you're planning to use the great [EsFormatter](https://github.com/millermedeiros/esformatter/) for your future development you might want to check that your EsFormatter configuration won't mess up badly with your existing code.

This tool goes through your code, formats it and tells you how much it differs from the original code.

It's __NOT__ smart enough to suggest you the best configuration or build it for you, but at least it gives you an index of the accuracy of your own configuration.

## Usage

The best is to install this tool globally with

````
npm install -g esformatter-diff
````

And then run it in your project folder with

````
esformatter-diff options.json
````

It'll give you the percentage of lines that after formatting differ from the original code.

For a more verbose information you can run

````
esformatter-diff --diff options.json
````

It'll also print the lines that differ, this might help you tweaking your configuration options or your source file.

You can also try the default configuration with

````
esformatter-diff --default
````

# License

Released under the MIT license