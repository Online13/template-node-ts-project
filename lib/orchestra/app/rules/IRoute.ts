import Handler from "../type/Handler";

interface IRoute {
    $url: string,
    $method: "GET" | "POST" | "PUT" | "DELETE",
    $handler: Handler;
};

export default IRoute;