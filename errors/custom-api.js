class CustomAPIError extends Error {
  constructor(message) {
    super(message);
    // this.StatusCode = StatusCodes.BAD_REQUEST
  }
}

export default CustomAPIError;
