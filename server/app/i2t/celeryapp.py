# to launch:
# $ cd app/
# $ celery --app=i2t.celeryapp --loglevel=debug --concurrency=1 --pool=solo worker

import math
import os
import sys

from celery import Celery, signals

# relative to app/
sys.path.append('lib')
sys.path.append('i2t')

# create app
app = Celery('i2t_tasks')
app.config_from_object('celeryconfig')


@signals.worker_init.connect
def init_model(sender=None, **kwargs):

    # global imports
    global tf, configuration, inference_wrapper, \
        caption_generator, vocabulary

    import tensorflow as tf
    from im2txt import configuration, inference_wrapper
    from im2txt.inference_utils import caption_generator, vocabulary

    global generator, vocab, sess

    # supress annoing errors
    tf.logging.set_verbosity(tf.logging.ERROR)

    g = tf.Graph()

    with g.as_default():
        model = inference_wrapper.InferenceWrapper()
        restore_fn = model.build_graph_from_config(configuration.ModelConfig(),
                                                   app.conf.CHECKPOINT)
    g.finalize()

    vocab = vocabulary.Vocabulary(app.conf.VOCAB_FILE)

    # limit GPU memory
    gpu_options = tf.GPUOptions(
        per_process_gpu_memory_fraction=app.conf.GPU_MEMORY_FRACTION)

    sess = tf.Session(graph=g, config=tf.ConfigProto(gpu_options=gpu_options))

    with sess.as_default():
        restore_fn(sess)

        # Prepare the caption generator. Here we are implicitly using the default
        # beam search parameters. See caption_generator.py for a description of the
        # available beam search parameters.
        generator = caption_generator.CaptionGenerator(model, vocab)


@app.task
def generate_caption(uploaded_file):

    global generator, vocab, sess

    # filter potential malicious filenames with path included
    if os.path.basename(uploaded_file) != uploaded_file:
        raise Exception('Invalid input file')

    uploaded_file = os.path.join(app.conf.UPLOADS_DIR, uploaded_file)

    if not os.path.isfile(uploaded_file):
        raise Exception('File not found')

    with tf.gfile.GFile(uploaded_file, 'r') as f:
        image = f.read()

    captions = generator.beam_search(sess, image)
    sentences = []

    for i, caption in enumerate(captions):
        # ignore begin and end words
        sentence = [vocab.id_to_word(w) for w in caption.sentence[1:-1]]

        sentence = ' '.join(sentence)
        sentences.append({'sentence': sentence, 'p': math.exp(caption.logprob)})

    return sentences
