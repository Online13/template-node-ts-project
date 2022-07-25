import Renderer from "./Renderer";
import Router from "./Router";

abstract class Controller {

    public router: Router;
    public renderer: Renderer;

    constructor() {
        this.router = new Router();
        this.renderer = Renderer.getRenderer();
        this.route();
    }

    abstract route(): void;

}

export default Controller;