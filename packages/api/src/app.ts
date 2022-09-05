import createServer from './server';

createServer().listen(5000, () => {
    console.log(`Server listening on port 5000`);
});