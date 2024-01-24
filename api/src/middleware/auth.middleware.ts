import { NextFunction, Request, Response } from "express";
import  jwt, { VerifyErrors }  from "jsonwebtoken";
import { config } from "../util/config.util";

interface CustomRequest extends Request {
  user?: any
};

export const authenticate = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authToken = req.cookies.accessToken;
  if (!authToken) {
    return res.send({
      message: "Unauthorized Access"
    })
  } else {
    jwt.verify(authToken, config.SECRET_KEY as string, (err: VerifyErrors | null, data: any) => {
      if (err) {
        res.send({
          message: "Error in authorization",
          status: false
        })
      } else {
        req.user = data;
        next();
      }
    })
  }
}