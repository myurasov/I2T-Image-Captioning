'''
CLI
'''

import os
import time
import click


def init_cli(app):

    # CLI cleanup_uploads
    @app.cli.command()
    @click.option('--dry', help='Dry run', is_flag=True, default=False)
    def cleanup_uploads(dry):
        '''Removes old uploads'''

        # get files in directory
        def get_files(src_dir):
            f = []
            for (dirpath, dirnames, filenames) in os.walk(src_dir):
                f.extend(filenames)
                break
            return f

        click.echo('Cleaning uploads dir...')

        now = time.time()

        uploads_dir = os.path.join(app.instance_path, app.config['UPLOADS_DIR'])
        files = get_files(uploads_dir)

        to_remove = 0

        for f in files:
            f_path = os.path.join(uploads_dir, f)
            m = os.path.getctime(f_path)
            age = now - m

            if age > app.config['UPLOADS_MAX_AGE']:
                to_remove += 1
                if not dry: os.unlink(f_path)
                click.echo('Removed "%s" (created %ds ago)' % (f, age))
        else:
            f = []

        click.echo('Total files: %d, removed: %d' % (len(f), to_remove))
