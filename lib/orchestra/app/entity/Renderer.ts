import fs from "fs";
import path from "path";
import vm from "vm";
import { AppConfig, RendererConfig } from "../type";

const defaultConfig = {
    'views': 'views',
    'public': 'public',
};


class Renderer {

    private config:RendererConfig = defaultConfig;
    static instance: Renderer | null = null;

    static getRenderer() {
        if (Renderer.instance === null) {
            Renderer.instance = new Renderer();
        }
        return Renderer.instance;
    }

    setConfig(key: AppConfig, value: string) {
        this.config[key] = value;
    }

    extract(text: string): string {

        type Vector = { action: string, code: string };

        const block: string[] = text.split(/<!--/);
        const vectors: Vector[] = block.map((row: string) => {
            if (/:|\+/.test(row[0])) {
                return row.split(/-->/).map((e, id) => {
                    if (id === 0) {
                        return { action: e[0], code: e.slice(1) };
                    } else {
                        return { action: '$', code: e };
                    }
                });
            } else {
                return { action: '$', code: row };
            }
        }).flat();
        const result = vectors.map((vector: Vector) => {
            switch (vector.action) {
                case ":":
                    return `result += ${vector.code.trim()};`;
                case "$":
                    return `result += \`${vector.code}\`;`;
                case "+":
                    return vector.code;
                default:
                    throw new Error('error ' + vector.action + " unknonw action.");
            }
        });
        return result.join('');
    }

    translate(options: any|null, data: string): string {
        if (options === null) {
            return data;
        }
        let context = { ...options, result: "" };
        vm.createContext(context);
        vm.runInContext(this.extract(data), context);
        return context.result;
    }

    render(fullPath: string, options: any|null = null) {
        return new Promise<string>((resolve, reject) => {
            const p = path.join(this.config['views'], fullPath);
            fs.readFile( p, { encoding: 'utf-8' }, (err, data) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
                resolve(this.translate(options, data));
            });
        });
    }

}

export default Renderer;