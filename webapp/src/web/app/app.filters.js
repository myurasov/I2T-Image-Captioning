/**
 * Filters
 */

export default (app) => {

  /**
   * Format name
   */
  app.filter('formatCaption', () => v => {
    if (v) {
      v = v.replace(/[\s\.]+$/, '');
      v = v.charAt(0).toUpperCase() + v.slice(1);
      return v;
    }
  });

};
