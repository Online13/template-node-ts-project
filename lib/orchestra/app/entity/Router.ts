import path from 'path';
import type IRoute from '../rules/IRoute';
import type IRouter from '../rules/IRouter';
import type Handler from '../type/Handler';


class Router implements IRouter<Router> {
    
    private _routes: IRoute[];

    constructor() {
        this._routes = [];
    }

    get routes(): IRoute[] {
        return this._routes;
    }

    public use(url: string, router: Router) {
        this._routes = this._routes.concat(
            router._routes.map(({ $url, ...props }) => {
                return { $url: path.join(url, $url), ...props };
            })
        );
    }
    
    public get(url: string, handler: Handler) {
        this._routes.push({
            $url: url,
            $method: "GET",
            $handler: handler
        });
    }
    
    public post(url: string, handler: Handler) {
        this._routes.push({
            $url: url,
            $method: "POST",
            $handler: handler
        });
    }
    
    public put(url: string, handler: Handler) {
        this._routes.push({
            $url: url,
            $method: "PUT",
            $handler: handler
        });
    }
    
    public delete(url: string, handler: Handler) {
        this._routes.push({
            $url: url,
            $method: "DELETE",
            $handler: handler
        });
    }
}

export default Router;