import { validate } from "../services/authication.js";

export const checkforcookie = (token) => {
  return (req, res, next) => {
    const tokenvalue = req.cookies?.token;

    if (!tokenvalue) return next();
    try {
      const userpayload = validate(tokenvalue);

      req.user = userpayload;
    } catch (error) {}
    next();
  };
};
