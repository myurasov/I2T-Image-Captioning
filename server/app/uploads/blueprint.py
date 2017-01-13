# uploads

import os
import uuid

from flask import Blueprint, Response, current_app, jsonify, request

blueprint = Blueprint('uploads', __name__)


# POST /uploads
@blueprint.route('/uploads', methods=['POST'])
def upload_file():
    f = request.files['file']

    if 'image/jpeg' == f.mimetype: ext = 'jpg'
    else: raise Exception('Unsupported mime type: ' + f.mimetype)

    filename = str(uuid.uuid4()) + '.' + ext

    f.save(os.path.join(current_app.instance_path, \
                     current_app.config['UPLOADS_DIR'], \
                     filename))

    # todo: check for max size
    # todo: implement throttling
    # todo: use md5 instead of uuid

    return jsonify(error=0, message='OK', file=filename)
