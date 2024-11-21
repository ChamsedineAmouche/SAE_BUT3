DROP DATABASE IF EXISTS vue_user;

-- Création des bases de données
CREATE DATABASE vue_user;

-- Utilisation de la base de données vue_user
USE vue_user;

-- Création des tables pour le schéma vue_user
CREATE TABLE company (
   siren CHAR(14),
   nom VARCHAR(50) NOT NULL,
   email VARCHAR(75) NOT NULL,
   password VARCHAR(75) NOT NULL,
   adress VARCHAR(255) NOT NULL,
   zipcode VARCHAR(5) NOT NULL,
   city VARCHAR(50) NOT NULL,
   phone VARCHAR(10) NOT NULL,
   PRIMARY KEY(siren)
);

CREATE TABLE preference (
   Id_preference INT AUTO_INCREMENT,
   preference JSON NOT NULL,
   siren CHAR(14) NOT NULL,
   PRIMARY KEY(Id_preference),
   UNIQUE(siren),
   FOREIGN KEY(siren) REFERENCES company(siren)
);

CREATE TABLE log (
   id_log INT AUTO_INCREMENT,
   action VARCHAR(50) NOT NULL,
   log_timestamp DATETIME NOT NULL,
   siren CHAR(14) NOT NULL,
   PRIMARY KEY(id_log),
   FOREIGN KEY(siren) REFERENCES company(siren)
);

CREATE TABLE elearning (
   Id_elearning INT AUTO_INCREMENT,
   title VARCHAR(50) NOT NULL,
   description TEXT NOT NULL,
   price INT NOT NULL,
   subscription_date DATE NOT NULL,
   token VARCHAR(50),
   password VARCHAR(50),
   course_id INT,
   siren CHAR(14) NOT NULL,
   PRIMARY KEY(Id_elearning),
   FOREIGN KEY(siren) REFERENCES company(siren)
);

CREATE TABLE event (
   event_id INT,
   title VARCHAR(50) NOT NULL,
   description TEXT NOT NULL,
   event_date DATETIME NOT NULL,
   location VARCHAR(50) NOT NULL,
   capacity INT NOT NULL,
   status VARCHAR(50),
   PRIMARY KEY(event_id)
);

CREATE TABLE condition_type (
   Id_condition_type INT AUTO_INCREMENT,
   label VARCHAR(50) NOT NULL,
   PRIMARY KEY(Id_condition_type)
);

CREATE TABLE object_type (
   Id_object_type INT AUTO_INCREMENT,
   label VARCHAR(50) NOT NULL,
   PRIMARY KEY(Id_object_type)
);

CREATE TABLE container (
   Id_Container INT AUTO_INCREMENT,
   adress VARCHAR(50) NOT NULL,
   city VARCHAR(50) NOT NULL,
   zipcode VARCHAR(5) NOT NULL,
   capacity INT NOT NULL,
   PRIMARY KEY(Id_Container)
);

CREATE TABLE inscription (
   Id_inscription INT AUTO_INCREMENT,
   event_id INT NOT NULL,
   siren CHAR(14) NOT NULL,
   PRIMARY KEY(Id_inscription),
   FOREIGN KEY(event_id) REFERENCES event(event_id),
   FOREIGN KEY(siren) REFERENCES company(siren)
);

CREATE TABLE emplacement (
   Id_emplacement INT AUTO_INCREMENT,
   available BOOLEAN,
   dimension VARCHAR(11),
   Id_Container INT NOT NULL,
   PRIMARY KEY(Id_emplacement),
   FOREIGN KEY(Id_Container) REFERENCES container(Id_Container)
);

CREATE TABLE listing (
   Id_item INT AUTO_INCREMENT,
   title VARCHAR(50) NOT NULL,
   description TEXT NOT NULL,
   dimension VARCHAR(11),
   date_posted DATE,
   status VARCHAR(50),
   Id_emplacement INT NOT NULL,
   siren CHAR(14) NOT NULL,
   Id_object_type INT NOT NULL,
   Id_condition_type INT NOT NULL,
   PRIMARY KEY(Id_item),
   UNIQUE(Id_emplacement),
   FOREIGN KEY(Id_emplacement) REFERENCES emplacement(Id_emplacement),
   FOREIGN KEY(siren) REFERENCES company(siren),
   FOREIGN KEY(Id_object_type) REFERENCES object_type(Id_object_type),
   FOREIGN KEY(Id_condition_type) REFERENCES condition_type(Id_condition_type)
);

CREATE TABLE listing_image (
   Id_listing_image INT AUTO_INCREMENT,
   image VARBINARY(255),
   Id_item INT NOT NULL,
   PRIMARY KEY(Id_listing_image),
   FOREIGN KEY(Id_item) REFERENCES listing(Id_item)
);

DROP DATABASE IF EXISTS vue_admin;
CREATE DATABASE vue_admin;
-- Utilisation de la base de données vue_admin
USE vue_admin;

-- Création des tables pour le schéma vue_admin
CREATE TABLE admin (
   admin_id INT,
   password VARCHAR(50) NOT NULL,
   rights JSON NOT NULL,
   PRIMARY KEY(admin_id)
);

CREATE TABLE article (
   Id_veille INT AUTO_INCREMENT,
   title VARCHAR(50) NOT NULL,
   article_date DATETIME,
   author VARCHAR(50) NOT NULL,
   content TEXT NOT NULL,
   image VARBINARY(50),
   admin_id INT NOT NULL,
   PRIMARY KEY(Id_veille),
   FOREIGN KEY(admin_id) REFERENCES admin(admin_id)
);

CREATE TABLE elearning_list (
   course_id VARCHAR(50),
   title VARCHAR(50),
   description TEXT NOT NULL,
   price VARCHAR(50),
   admin_id INT NOT NULL,
   PRIMARY KEY(course_id),
   FOREIGN KEY(admin_id) REFERENCES admin(admin_id)
);

CREATE TABLE event (
   id_event INT AUTO_INCREMENT,
   title VARCHAR(50) NOT NULL,
   description VARCHAR(50),
   event_date DATETIME NOT NULL,
   location VARCHAR(50) NOT NULL,
   capacity INT,
   status VARCHAR(50) NOT NULL,
   admin_id INT NOT NULL,
   PRIMARY KEY(id_event),
   FOREIGN KEY(admin_id) REFERENCES admin(admin_id)
);
