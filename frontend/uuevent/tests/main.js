define([ 'doh/runner', 'metaworld/main'],

function(doh, app){

    doh.registerTests("metaworld.tests.main", [
        function testApp() {
            doh.is('ok', app.test());
        },

        {
            name: 'Test',

            runTest: function testBar() {
                doh.t(true);
            }
        }
        ]);

    doh.run();

});
