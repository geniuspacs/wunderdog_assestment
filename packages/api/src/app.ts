import * as dotenv from 'dotenv';
dotenv.config();

import createServer from './server';

createServer().listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});