'''
App
'''

import os
import uuid

from flask import Flask, Response, jsonify, request

from cli import init_cli
from flask_cors import CORS, cross_origin
from i2t.blueprint import create_blueprint as create_i2t_blueprint
from uploads.blueprint import blueprint as uploads_blueprint


# create app
def create_app(environment):
    app = Flask('i2t_server')

    # + cross origin resource sharing
    CORS(app)

    # load config
    config_object = 'config.' + environment.title() + 'Config'
    app.config.from_object(config_object)

    # set log level
    app.logger.setLevel(app.config['LOG_LEVEL'])

    # [debug] log used config
    app.logger.debug('Using config "%s"' % config_object)

    # create app dirs
    create_instance_dirs(app)

    # [debug]
    app.logger.debug('Creating instance dirs...')

    return app


#  make app dirs
def create_instance_dirs(app):
    for d in [app.config['UPLOADS_DIR']]:
        d = os.path.join(app.instance_path, d)
        if not os.path.isdir(d):
            os.makedirs(d)


# create app
app = create_app(os.getenv('ENVIRONMENT', 'production'))


# index page
@app.route('/api/v1/')
def index():
    return Response(app.name + ' is here', mimetype='text/plain')


# init blueprints

app.register_blueprint(uploads_blueprint, url_prefix='/api/v1')

app.register_blueprint(
    create_i2t_blueprint(queue_name='i2t'), \
    url_prefix='/api/v1/queues/i2t'
)

# init cli
init_cli(app)
