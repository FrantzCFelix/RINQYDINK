DROP DATABASE IF EXISTS phaser_db;

CREATE DATABASE phaser_db;

USE phaser_db;

CREATE TABLE IF NOT EXISTS `Users` (
    `id` INTEGER NOT NULL auto_increment , 
    `username` VARCHAR(255) NOT NULL UNIQUE, 
    `password` VARCHAR(255), `createdAt` DATETIME NOT NULL, 
    `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `HighScores` (
    `id` INTEGER NOT NULL auto_increment , 
    `score` INTEGER NOT NULL, `createdAt` DATETIME NOT NULL, 
    `updatedAt` DATETIME NOT NULL, `UserId` INTEGER NOT NULL, 
    PRIMARY KEY (`id`), 
    FOREIGN KEY (`UserId`) REFERENCES `Users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
);