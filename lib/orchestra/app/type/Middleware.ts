import Request from './Request';
import Response from './Response';

type Middleware = (req: Request, res: Response, next: Function) => void | number;

export default Middleware;