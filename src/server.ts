import 'dotenv/config';
import App from '@shared/infra/http/app';

// https://imasters.com.br/data/crud-completo-com-redis-mongodb-e-node-js
// github.com/stockholmux/redredisearch

const port = process.env.PORT || 3000;

App.start(port, () => {
    console.log(`Listen in port :${port}`);
});
