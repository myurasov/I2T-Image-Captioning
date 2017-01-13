import sys

from flask import Blueprint, current_app, jsonify, request
from redis import Redis

from celery.backends.redis import RedisBackend
from celery.exceptions import TimeoutError
from celery.execute import send_task
from celery.result import AsyncResult

# relative to app/
sys.path.append('i2t')  # isort:skip
from celeryapp import app as celeryapp  # isort:skip
import celeryconfig  # isort:skip


# create blueprint
def create_blueprint(queue_name):
    blueprint = Blueprint('i2t_tasks_api', __name__)

    # POST /tasks
    @blueprint.route('/tasks', methods=['POST'])
    def create_task():

        data = request.json if request.json else request.form

        # wait for the task to complete?
        wait = data.get('wait', current_app.config['I2T_TASK_MAX_TIMEOUT'])
        wait = float(wait)
        wait = min(wait, current_app.config['I2T_TASK_MAX_TIMEOUT'])

        async_res = send_task(
            'i2t.celeryapp.generate_caption',
            kwargs={'uploaded_file': data['file']})

        result = None
        task_id = async_res.id
        delayed = not wait

        if wait > 0:
            try:
                result = async_res.get(timeout=wait)
            except TimeoutError as e:
                delayed = True

        return jsonify(
            error=0,
            message='OK',
            result=result,
            delayed=delayed,
            task_id=task_id,
            _wait=wait)

    # GET /tasks/<id>
    @blueprint.route('/tasks/<id>', methods=['GET'])
    def get_task(id):

        async_res = AsyncResult(id, app=celeryapp)
        result = None if isinstance(async_res.result, \
                                    Exception) else async_res.result
        return jsonify(error=0, message='OK', \
                       state=async_res.state, result=result)

    return blueprint
