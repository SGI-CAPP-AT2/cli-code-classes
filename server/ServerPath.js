export class ServerPath {
  /**
   * This is the path of the server.
   * @param {String} path
   */
  constructor(path, fn) {
    this.path = path;
    this.fn = fn;
  }
  /**
   * This function is used to execute the function of the path.
   * @param {Request} req
   * @param {Response} res
   */
  execute(req, res) {
    if (!this.fn) {
      res.statusCode = 404;
      res.end();
      return;
    }
    this.completeHandler(this.fn(req, res));
  }
  dispose() {
    this.fn = null;
  }
  onCompleteTask(handler) {
    this.completeHandler = handler;
  }
}
