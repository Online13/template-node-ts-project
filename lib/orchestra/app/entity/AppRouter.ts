import fs from "fs";
import path from "path";
import EventEmitter from "events";
import type IRouter from "../rules/IRouter";
import type Router from "./Router";
import type IRoute from "../rules/IRoute";
import type Handler from "../type/Handler";
import type Request from "../type/Request";
import type Response from "../type/Response";
import MiddlewareError from "../error/MiddlewareError";
import type Middleware from "../type/Middleware";
import type AppConfig from "../type/AppConfig";
import Renderer from "./Renderer";


class AppRouter implements IRouter<Router> {
    
    private middlewares: Middleware[];
    private emitter: EventEmitter;
    private renderer: Renderer;

    constructor() {
        this.middlewares = [];
        this.renderer = Renderer.getRenderer();
        this.emitter = new EventEmitter();
        this.dispatch = this.dispatch.bind(this);

        this.setup();
    }

    /**
     * Extract body from the request
     * @param req 
     */
    static getBody(req: Request) {
        return new Promise<string>((resolve, reject) => {
            let body: string = "";
            req.on('readable', () => {
                body += req.read();
            });
            req.on('error', reject);
            req.on('end', () => resolve(body));
        });
    }

    private setup() {
        this.emitter.on('404', (req: Request, res: Response) => {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end("Page not found...");
        })
    }

    public async dispatch(req: Request, res: Response) {
        try {
            // execute all middlewares and throw MiddlewareError
            // if there are error
            await this.handleMiddlewares(req, res);
            // test if we have been define this route and method
            const event = `${req.method} ${req.url}`;
            if (this.emitter.listenerCount(event) > 0)
                this.emitter.emit(event, req, res);
            else
                this.emitter.emit('404', req, res);
        } catch (error) {
            if (error instanceof MiddlewareError) {
                res.statusCode = error.getStatusCode();
                res.end(JSON.stringify(error.getData()));
            }
        }
    }

    public set(key: AppConfig, value: string) {
        this.renderer.setConfig(key, value);
    }

    private async handleMiddlewares(req: Request, res: Response) {
        for (const middleware of this.middlewares) {
            await new Promise((resolve, reject) => {
                middleware(req, res, resolve);
            });
        }
    }

    public use(param: string | Middleware, router: Router | null = null): void {
        if (typeof param === "function") {
            this.middlewares.push(param);
            return;
        }
        const url: string = param; 
        router?.routes.forEach((route: IRoute) => {
            this.emitter.on(`${route.$method} ${path.join(url, route.$url)}`, route.$handler);
        });
    }

    public get(url: string, handler: Handler): void {
        this.emitter.on(`GET ${url}`, handler);
    }

    public post(url: string, handler: Handler): void {
        this.emitter.on(`POST ${url}`, handler);
    }

    public put(url: string, handler: Handler): void {
        this.emitter.on(`PUT ${url}`, handler);
    }

    public delete(url: string, handler: Handler): void {
        this.emitter.on(`DELETE ${url}`, handler);
    }

}

export default AppRouter;