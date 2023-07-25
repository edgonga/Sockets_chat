import app from './app';

const PORT = 3000;

const start = async() => {
    try {
        await app.listen({ port: 3000 });
        console.log(`✅ Server running on port ${PORT}`);
    } catch (error) {
        console.error(`🔴 Error starting server: ${error}`);
        
    }
}

start()