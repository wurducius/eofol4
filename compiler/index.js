const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
    apply(compiler) {
        compiler.hooks.run.tap(pluginName, (compilation) => {
            console.log('Eofol4 build');
        });

        compiler.hooks.watchRun.tap(pluginName, (compilation) => {
            console.log('Eofol4 start');
        });
    }
}

module.exports = ConsoleLogOnBuildWebpackPlugin;