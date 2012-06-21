import sys, os

package_dir = "packages"
package_dir_path = os.path.join(os.path.dirname(__file__), package_dir)
sys.path.insert(0, package_dir_path)

from settings import DEBUG
from backend import app

def main():
    if DEBUG:
        # Run debugged app
        from werkzeug_debugger_appengine import get_debugged_app
        from wsgiref.handlers import CGIHandler
        app.debug=True
        debugged_app = get_debugged_app(app)
        CGIHandler().run(debugged_app)
    else:
        from google.appengine.ext.webapp.util import run_wsgi_app
        run_wsgi_app(app)

if __name__ == '__main__':
    main()
