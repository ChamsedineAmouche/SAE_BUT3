-- Suppression des tables si elles existent déjà
DROP TABLE IF EXISTS vue_user.company;
DROP TABLE IF EXISTS vue_user.preference;
DROP TABLE IF EXISTS vue_user.log;
DROP TABLE IF EXISTS vue_user.announce;
DROP TABLE IF EXISTS vue_user.reservation;
DROP TABLE IF EXISTS vue_user.container;
DROP TABLE IF EXISTS vue_user.event;
DROP TABLE IF EXISTS vue_user.elearning;
DROP TABLE IF EXISTS vue_user.object_type;
DROP TABLE IF EXISTS vue_user.emplacement;
DROP TABLE IF EXISTS vue_user.veille;
DROP TABLE IF EXISTS vue_user.inscription;

DROP TABLE IF EXISTS vue_admin.admin;
DROP TABLE IF EXISTS vue_admin.elearning_list;
DROP TABLE IF EXISTS vue_admin.event_list;
DROP TABLE IF EXISTS vue_admin.condition_type;

-- Suppression des schémas pour réinitialiser l'environnement
DROP SCHEMA IF EXISTS vue_user;
DROP SCHEMA IF EXISTS vue_admin;

-- Création des schémas
CREATE SCHEMA vue_admin;
CREATE SCHEMA vue_user;

-- Création des tables dans les schémas respectifs

-- Tables dans le schéma vue_user
CREATE TABLE vue_user.company (
   `siren` INTEGER NOT NULL UNIQUE,
   `nom` VARCHAR(50) NOT NULL,
   `email` VARCHAR(255) NOT NULL,
   `password` VARCHAR(255) NOT NULL,
   `adress` VARCHAR(255) NOT NULL,
   `zipcode` VARCHAR(255) NOT NULL,
   `city` VARCHAR(50) NOT NULL,
   `token` VARCHAR(255) NOT NULL,
   PRIMARY KEY(`siren`)
);

CREATE TABLE vue_user.preference (
   `p_siren` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
   `preference` JSON NOT NULL,
   PRIMARY KEY(`p_siren`)
);

CREATE TABLE vue_user.log (
   `log_id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
   `l_siren` INTEGER NOT NULL,
   `action` VARCHAR(255) NOT NULL,
   PRIMARY KEY(`log_id`)
);

CREATE TABLE vue_user.announce (
   `annouceID` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
   `a_siren` INTEGER NOT NULL,
   `title` VARCHAR(50) NOT NULL,
   `description` TEXT(65535) NOT NULL,
   `dimension` VARCHAR(255),
   `condition` INTEGER NOT NULL,
   `images` VARCHAR(255) NOT NULL,
   `date_posted` DATETIME NOT NULL,
   `expiry_date` DATE NOT NULL,
   `status` VARCHAR(255),
   `announce_type` INTEGER,
   PRIMARY KEY(`annouceID`)
);

CREATE TABLE vue_user.reservation (
   `reservationID` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
   `r_siren` INTEGER NOT NULL,
   `r_annonce` INTEGER NOT NULL,
   `r_container` INTEGER NOT NULL,
   `date_reservation` VARCHAR(255) NOT NULL,
   `status` VARCHAR(255) NOT NULL,
   PRIMARY KEY(`reservationID`)
);

CREATE TABLE vue_user.container (
   `containerID` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
   `adress` VARCHAR(255) NOT NULL,
   `zipcode` VARCHAR(255),
   `city` VARCHAR(255),
   `capacity` INTEGER NOT NULL,
   PRIMARY KEY(`containerID`)
);

CREATE TABLE vue_user.event (
   `event_id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
   `title` VARCHAR(255) NOT NULL,
   `description` VARCHAR(255) NOT NULL,
   `date` DATETIME NOT NULL,
   `location` VARCHAR(255) NOT NULL,
   `capacity` INTEGER NOT NULL,
   `status` VARCHAR(255) NOT NULL,
   PRIMARY KEY(`event_id`)
);

CREATE TABLE vue_user.elearning (
   `id` INTEGER NOT NULL,
   `title` VARCHAR(255) NOT NULL,
   `description` VARCHAR(255) NOT NULL,
   `price` INTEGER NOT NULL,
   `content` VARCHAR(255) NOT NULL,
   `subscription_date` DATE NOT NULL,
   `status` VARCHAR(255) NOT NULL,
   `p_siren` INTEGER NOT NULL,
   `course_id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
   PRIMARY KEY(`id`)
);

CREATE TABLE vue_user.object_type (
   `id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
   `label` VARCHAR(255),
   PRIMARY KEY(`id`)
);

CREATE TABLE vue_user.emplacement (
   `id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
   `disponible` BOOLEAN,
   `dimension` VARCHAR(255),
   `container_id` INTEGER,
   PRIMARY KEY(`id`)
);

CREATE TABLE vue_user.veille (
   `id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
   `title` VARCHAR(255),
   `date` DATETIME,
   `author` VARCHAR(255),
   `description` VARCHAR(255),
   `image` BLOB,
   `added_by` INTEGER NOT NULL,
   PRIMARY KEY(`id`)
);

CREATE TABLE vue_user.inscription (
   `id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
   `event_id` INTEGER,
   `p_siren` INTEGER,
   PRIMARY KEY(`id`)
);

-- Tables dans le schéma vue_admin
CREATE TABLE vue_admin.admin (
   `user_id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
   `password` VARCHAR(255) NOT NULL,
   `rights` JSON NOT NULL,
   PRIMARY KEY(`user_id`)
);

CREATE TABLE vue_admin.elearning_list (
   `course_id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
   `title` VARCHAR(255) NOT NULL,
   `description` TEXT(65535) NOT NULL,
   `price` INTEGER NOT NULL,
   `content` VARCHAR(255) NOT NULL,
   `added_by` INTEGER NOT NULL,
   PRIMARY KEY(`course_id`)
);

CREATE TABLE vue_admin.event_list (
   `id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
   `event_id` INTEGER NOT NULL,
   `title` VARCHAR(255) NOT NULL,
   `description` TEXT(65535) NOT NULL,
   `date` DATETIME NOT NULL,
   `location` VARCHAR(255) NOT NULL,
   `capacity` INTEGER NOT NULL,
   `added_by` INTEGER NOT NULL,
   PRIMARY KEY(`id`)
);

CREATE TABLE vue_admin.condition_type (
   `id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
   `label` VARCHAR(255) NOT NULL,
   PRIMARY KEY(`id`)
);

-- Définition des clés étrangères
ALTER TABLE vue_user.company
ADD FOREIGN KEY(`siren`) REFERENCES vue_user.preference(`p_siren`)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE vue_user.company
ADD FOREIGN KEY(`siren`) REFERENCES vue_user.log(`l_siren`)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE vue_user.company
ADD FOREIGN KEY(`siren`) REFERENCES vue_user.announce(`a_siren`)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE vue_user.company
ADD FOREIGN KEY(`siren`) REFERENCES vue_user.reservation(`r_siren`)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE vue_user.reservation
ADD FOREIGN KEY(`r_annonce`) REFERENCES vue_user.announce(`annouceID`)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE vue_user.container
ADD FOREIGN KEY(`containerID`) REFERENCES vue_user.reservation(`r_container`)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE vue_user.announce
ADD FOREIGN KEY(`announce_type`) REFERENCES vue_user.object_type(`id`)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE vue_user.emplacement
ADD FOREIGN KEY(`container_id`) REFERENCES vue_user.container(`containerID`)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE vue_user.elearning
ADD FOREIGN KEY(`p_siren`) REFERENCES vue_user.company(`siren`)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE vue_user.inscription
ADD FOREIGN KEY(`event_id`) REFERENCES vue_user.event(`event_id`)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE vue_user.inscription
ADD FOREIGN KEY(`p_siren`) REFERENCES vue_user.company(`siren`)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE vue_user.veille
ADD FOREIGN KEY(`added_by`) REFERENCES vue_admin.admin(`user_id`)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE vue_admin.elearning_list
ADD FOREIGN KEY(`added_by`) REFERENCES vue_admin.admin(`user_id`)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE vue_admin.event_list
ADD FOREIGN KEY(`added_by`) REFERENCES vue_admin.admin(`user_id`)
ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE vue_user.announce
ADD FOREIGN KEY(`condition`) REFERENCES vue_admin.condition_type(`id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
