"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongoDB = void 0;
/**
 * MongoDB Database Connection and Configuration
 *
 * This module handles the setup and configuration of the MongoDB database connection using the Mongoose library.
 * It also exports a function to establish the connection to the database and a constant for the application's port.
 */
const mongoose_1 = __importDefault(require("mongoose"));
const _1 = require(".");
/**
 * Establishes a connection to the MongoDB database.
 *
 * This function sets up a connection to the MongoDB database using the provided `MONGO_URL` configuration.
 * It enforces strict query mode for safer database operations. Upon successful connection, it logs the
 * host of the connected database. In case of connection error, it logs the error message and exits the process.
 */
const connectMongoDB = async () => {
    let isConnected = false;
    const connect = async () => {
        try {
            if (_1.mongoUrl) {
                const connection = await mongoose_1.default.connect(_1.mongoUrl);
                console.log(`MONGODB CONNECTED : ${connection.connection.host}`);
                isConnected = true;
            }
            else {
                console.log("No Mongo URL");
            }
        }
        catch (error) {
            console.log(`Error : ${error.message}`);
            isConnected = false;
            // Attempt to reconnect
            setTimeout(connect, 1000); // Retry connection after 1 seconds
        }
    };
    connect();
    mongoose_1.default.connection.on("disconnected", () => {
        console.log("MONGODB DISCONNECTED");
        isConnected = false;
        // Attempt to reconnect
        setTimeout(connect, 1000); // Retry connection after 5 seconds
    });
    mongoose_1.default.connection.on("reconnected", () => {
        console.log("MONGODB RECONNECTED");
        isConnected = true;
    });
};
exports.connectMongoDB = connectMongoDB;
//# sourceMappingURL=db.js.map