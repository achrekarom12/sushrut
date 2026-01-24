import 'dotenv/config';
import { buildApp } from './app';
import { PORT } from './env';

const start = async () => {
    try {
        const app = await buildApp();
        const port = Number(PORT);

        await app.listen({ port, host: '0.0.0.0' });

        console.log(`Server listening on http://localhost:${port}`);
        console.log(`Documentation available at http://localhost:${port}/docs`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

start();
