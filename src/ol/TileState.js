/**
 * @module ol/TileState
 */

/**
 * @enum {number}
 */
export default {
  IDLE: 0,
  LOADING: 1,
  LOADED: 2,
  /**
   * Indicates that tile loading failed
   * @type {number}
   */
  ERROR: 3,
  EMPTY: 4,
  ABORT: 5,
  // MapSuite
  CANCEL: 6,
};

//# sourceMappingURL=TileState.js.map