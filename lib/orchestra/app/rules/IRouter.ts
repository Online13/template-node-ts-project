import Handler from "../type/Handler";

interface IRouter<Type> {
    
    use(url: string, router: Type): void;

    get(url: string, handler: Handler): void;
    
    post(url: string, handler: Handler): void;
    
    put(url: string, handler: Handler): void;
    
    delete(url: string, handler: Handler): void;

}

export default IRouter;