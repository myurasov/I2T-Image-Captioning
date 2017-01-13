## Development

```sh
vagrant up
vagrant ssh
```

```sh
cd /projects/server
pip install -r requirements.txt
source venv/bin/activate
cd app
./debug.sh
```

## API

### Examples

Upload & process:

```sh
FILE=$(curl -X POST -F "file=@image.jpg" http://--server--/api/v1/uploads -s | jq -r .file) ; \
curl -X POST http://--server--/api/v1/queues/i2t/tasks -d "file=$FILE&wait=5" | jq .
```

### GET /

Info

### POST /uploads

```sh
curl -X POST -F "file=@_private/abarth.jpg" http://--server--/api/v1/uploads -s | jq .
```

```json
{
  "error": 0,
  "file": "ca732850-2ba8-4c22-aed0-8638b1a80172.jpg",
  "message": "OK"
}
```

### POST /queues/_queue_name_/tasks

```sh
curl -s -X POST http://--server--/api/v1/queues/i2t/tasks -d 'file=--uploaded-file-name--&wait=2' | jq .
```

### GET /queues/_queue_name_/tasks/_task_id_

```sh
curl http://--server--/queues/i2t/tasks/--task-id--

# result:
{
  "error": 0, 
  "message": "OK", 
  "result": ..., 
  "state": "FAILURE|PENDING|SUCCESS"
}
```

## CLI

### Remove Old Uploads

```
FLASK_APP=app.py flask cleanup_uploads --dry
```

## Celery Workers

(standalone)

```sh
export CUDA_VISIBLE_DEVICES="" ; celery --app=i2t.celeryapp --loglevel=info --concurrency=1 --pool=solo worker
```

(with pm2)

```sh
cd --app--/i2t/pm2
sudo pm2 startOrRestart apps.--env--.yml
```

## Monitoring with Flower

```sh
cd /var/www/i2t/server/app
. ../venv/bin/activate
flower -A i2t.celeryapp --port=5555 --address=0.0.0.0
```
