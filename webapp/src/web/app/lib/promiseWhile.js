/**
 * Loop with promises (for browser env)
 * @author Mikhail Yurasov <me@yurasov.me>
 * @version 1.0.0
 */

/**
 * While loop with promises
 * @param {function} condition
 * @param {function} action
 * @return {Priomise}
 */
export default (condition, action) => {
  return new Promise((resolve, reject) => {
    let lastResolvedWith;
    const loop = () => {
      if (condition()) {
        action().then((r) => {
          lastResolvedWith = r;
          setTimeout(loop, 0);
        }, reject);
      } else {
        resolve(lastResolvedWith);
      }
    };
    setTimeout(loop, 0);
  });
};
