import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./custom-api.js";

class UnauthorizedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.StatusCode = StatusCodes.FORBIDDEN;
  }
}

export default UnauthorizedError;
