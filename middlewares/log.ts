import { Request, Response } from "./../lib/orchestra";

/**
 * Middleware that log all method url called
 */
export default function log(req: Request, res: Response, next: Function) {
    console.log(`${req.method} ${req.url}`);
    // console.log('header',req.headers);
    console.log('==================================');
    next();
}