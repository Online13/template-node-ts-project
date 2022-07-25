import Request from './Request';
import Response from './Response';

type Handler = (req: Request, res: Response) => any;

export default Handler;