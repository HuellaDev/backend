const express = require('express');
const cors = require('cors');
// const fileUpload = require('express-fileupload')


// const { socketController } = require('../sockets/controller');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        // this.io = require('socket.io')(this.server);
        

        this.paths = {}



        // Connectar a base de datos
    

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicacion


        this.routes();
        //Sockets
        // this.sockets();
        
    }
    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio publico
        this.app.use(express.static('public'));


        // Fileupload - Carga de archivo
        // this.app.use(fileUpload({
        //     useTempFiles: true,
        //     tempFileDir: '/tmp/',
        //     createParentPath: true
        // }));
    }
    
    routes() {

    }
    // sockets(){
    //     this.io.on('connection', (socket)=> socketController(socket, this.io))
    // }


    listen() {
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;