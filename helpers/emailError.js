class EmailError extends Error {}

class ErrorChecker {
  static isEmailError(err) {
    return err instanceof EmailError;
  }
}

module.exports = ErrorChecker;