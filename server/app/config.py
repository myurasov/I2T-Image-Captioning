'''
Config
'''

import logging


class Config(object):

    DEBUG = False
    TESTING = False
    LOG_LEVEL = logging.ERROR

    UPLOADS_DIR = 'uploads'  # relative to instance dir
    UPLOADS_MAX_AGE = 3600 * 12 # [s] max age of uploads to keep

    REDIS_OPTIONS = {'host': 'localhost', 'port': 6379, 'db': 0}

    I2T_TASK_MAX_TIMEOUT = 5.

class ProductionConfig(Config):
    pass


class DevelopmentConfig(Config):
    DEBUG = True
    LOG_LEVEL = logging.DEBUG


class TestingConfig(Config):
    TESTING = True
    LOG_LEVEL = logging.DEBUG
