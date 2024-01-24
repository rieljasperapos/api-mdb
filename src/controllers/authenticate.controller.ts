import { Request, Response } from 'express'

interface CustomRequest extends Request {
  user?: any
};

export const getAuthenticate = (req: CustomRequest, res: Response) => {
  return res.send({message: "Authenticated", status: true, data: req.user})
}

export const destroyAuthenticate = (req: Request, res: Response) => {
  res.clearCookie('accessToken');
  return res.send({
    message: "Successfully logged out"
  })
}