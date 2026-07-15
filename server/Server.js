import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import helmet from "helmet";



//Routes
import testRoutes from "../routers/test.routes.js";
import profileRoutes from "../routers/profile.routes.js";
import lostReportRoutes from "../routers/lostReport.routes.js";
import sightingReportRoutes from "../routers/sightingReport.routes.js";
import photoRoutes from "../routers/photo.routes.js";
import commentRoutes from "../routers/comment.routes.js";
import notificationRoutes from "../routers/notification.routes.js";
import organizationRoutes from "../routers/organization.routes.js";

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
            lostReports: `${this.pathOwner}/lost-reports`,
            sightingReports: `${this.pathOwner}/sighting-reports`,
            photos: `${this.pathOwner}/photos`,
            comments: `${this.pathOwner}/comments`,
            notifications: `${this.pathOwner}/notifications`,
            organizations: `${this.pathOwner}/organizations`,


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
        // Helmet
        this.app.use(helmet());

        // CORS
        this.app.use(cors());

        // Reading and parsing of body
        this.app.use(express.json());

        // Public Directory 
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
        this.app.use(this.paths.lostReports, lostReportRoutes);
        this.app.use(this.paths.sightingReports, sightingReportRoutes);
        this.app.use(this.paths.photos, photoRoutes);
        this.app.use(this.paths.comments, commentRoutes);
        this.app.use(this.paths.notifications, notificationRoutes);
        this.app.use(this.paths.organizations, organizationRoutes);


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