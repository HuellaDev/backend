import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";



//Routes
import testRoutes from "../routers/test.routes.js";
import profileRoutes from "../routers/profile.routes.js";

// const fileUpload = require('express-fileupload')


// const { socketController } = require('../sockets/controller');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        
        this.server = http.createServer(this.app)
        // this.io = require('socket.io')(this.server);


        this.pathOwner = '/api/huella';
        this.paths = {
            test: `${this.pathOwner}/test`,
            profile: `${this.pathOwner}/profile`,


        }



        // Connectar a base de datos


        // Middlewares
        this.middlewares();

        // Rutas de mi aplicacion


        this.routes();
        //Sockets
        // this.sockets();

    }
    async conectarDB() {
       
        try {
            await dbConnection(); 
        } catch (error) {
            console.error('We cannot connect with the DB')
            
        }
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
        this.app.use(this.paths.test, testRoutes);
        this.app.use(this.paths.profile, profileRoutes);


    }
    // sockets(){
    //     this.io.on('connection', (socket)=> socketController(socket, this.io))
    // }


    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}




export default Server;