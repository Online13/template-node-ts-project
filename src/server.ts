import http from 'http';
import App from './app';
import './config';
 
class Server {

    server: http.Server;

    constructor() {
        const app = new App();
        this.server = http.createServer(app.instance);
    }

    public start() {
        const host = Number(process.env.HOST) || 8000;
        this.server.listen(process.env.PORT, host, () => {
            console.log('Listening on', process.env.PORT);
        });
    }
}

export default Server;