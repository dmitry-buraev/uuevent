function copyOnly(filename, mid) {
    return /(png|jpg|jpeg|gif|tiff)$/.test(filename); 
}

var profile = {
    action: 'release',
    basePath: '..', //Dir static/js is base path
    releaseDir: '../deployed',

    mini: true, //Exclude tests, demos and etc
    optimize: 'closure', //Closure Compiler for minifying, shrinksafe is default
    layerOptimize: 'closure', //Minifier for building layers
    cssOptimize: 'comments', //Strip comments
    stripConsole: 'all', //Strip console.(log|debug|error) statement

    selectorEngine: 'acme', //Use default selector engine, not lightweight

    staticHasFeatures: {
        //Used for debugging loader, no needed for production
        'dojo-trace-api': 0,
        'dojo-log-api': 0,
        'dojo-publish-privates': 0,
        //No needed, because we're async
        'dojo-sync-loader': 0,
        'dojo-xhr-factory': 0,
        //Don't load tests
        'dojo-test-sniff': 0
    },

    resourceTags: {
        amd: function(filename, mid) {
            return !copyOnly && /\.js$/.test(filename);
        },

        copyOnly: function(filename, mid) {
            return copyOnly(filename, mid);
        }
    },

    layers: {
        'dojo/dojo': {
            include: [
                'dojo/dojo', 'dojo/domReady',
                'dijit/_Widget', 'dijit/_TemplatedMixin',
                'dijit/layout/BorderContainer', 'dijit/layout/ContentPane',
                'dojo/store/JsonRest', 'dijit/Tree',
                'uuevent/main'
            ], // Needed stuff for main page
            // Make custom and bootable base
            customBase: true, 
            boot: true
        }
    }
};
