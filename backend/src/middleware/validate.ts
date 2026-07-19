import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";
import { ApiError } from "../utils/ApiError";

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      next(new ApiError(400, message));
      return;
    }
    req.body = result.data;
    next();
  };
}
