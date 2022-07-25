import { AppRouter, Request, Response } from "../lib/orchestra";
import log from "../middlewares/log";


class App {

    app: AppRouter;

    constructor() {
        this.app = new AppRouter();
        this.middleware();
        this.router();

        this.instance = this.instance.bind(this);
    }

    middleware() {
        this.app.use(log);
    }

    router() {
        this.app.get('/', (req: Request, res: Response) => {
            res.end('home');
        });
        this.app.get('/test', (req: Request, res: Response) => {
            res.end('test');
        });
    }

    instance(req: Request, res: Response) {
        this.app.dispatch(req, res);
    }

}

export default App;