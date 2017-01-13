# celery settings
broker_url = 'redis://localhost:6379/0'
result_backend = 'redis://localhost:6379/0'
broker_transport_options = {'visibility_timeout': 120} # [s]

# app settings
UPLOADS_DIR = 'instance/uploads' # relative ato app root
CHECKPOINT = 'res/model.ckpt-3000000'
VOCAB_FILE = 'res/word_counts.txt'
GPU_MEMORY_FRACTION = None # no limit
