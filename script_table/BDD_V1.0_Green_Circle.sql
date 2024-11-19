-- Suppression des tables si elles existent déjà
DROP TABLE IF EXISTS vue_user.company;
DROP TABLE IF EXISTS vue_user.preference;
DROP TABLE IF EXISTS vue_user.log;
DROP TABLE IF EXISTS vue_user.listing;
DROP TABLE IF EXISTS vue_user.listing_image;
DROP TABLE IF EXISTS vue_user.container;
DROP TABLE IF EXISTS vue_user.event;
DROP TABLE IF EXISTS vue_user.elearning;
DROP TABLE IF EXISTS vue_user.object_type;
DROP TABLE IF EXISTS vue_user.emplacement;
DROP TABLE IF EXISTS vue_user.inscription;
DROP TABLE IF EXISTS vue_user.condition_type;

DROP TABLE IF EXISTS vue_admin.admin;
DROP TABLE IF EXISTS vue_admin.elearning_list;
DROP TABLE IF EXISTS vue_admin.article;

-- Suppression des schémas pour réinitialiser l'environnement
DROP SCHEMA IF EXISTS vue_user;
DROP SCHEMA IF EXISTS vue_admin;

-- Création des schémas
CREATE SCHEMA vue_user;
CREATE SCHEMA vue_admin;


-- SCHEMA USER
CREATE TABLE vue_user.company(
   siren INT,
   nom VARCHAR(50) NOT NULL,
   email VARCHAR(75) NOT NULL,
   password VARCHAR(75) NOT NULL,
   adress VARCHAR(255) NOT NULL,
   zipcode VARCHAR(5) NOT NULL,
   city VARCHAR(50) NOT NULL,
   phone VARCHAR(10) NOT NULL,
   PRIMARY KEY(siren)
);

CREATE TABLE vue_user.preference(
   Id_preference COUNTER,
   preference JSON NOT NULL,
   siren INT NOT NULL,
   PRIMARY KEY(Id_preference),
   UNIQUE(siren),
   FOREIGN KEY(siren) REFERENCES company(siren)
);

CREATE TABLE vue_user.log(
   id_log COUNTER,
   action VARCHAR(50) NOT NULL,
   log_timestamp DATETIME NOT NULL,
   siren INT NOT NULL,
   PRIMARY KEY(id_log),
   FOREIGN KEY(siren) REFERENCES company(siren)
);

CREATE TABLE vue_user.elearning(
   Id_elearning COUNTER,
   title VARCHAR(50) NOT NULL,
   description TEXT NOT NULL,
   price INT NOT NULL,
   subscription_date DATE NOT NULL,
   token VARCHAR(50),
   password VARCHAR(50),
   course_id INT,
   siren INT NOT NULL,
   PRIMARY KEY(Id_elearning),
   FOREIGN KEY(siren) REFERENCES company(siren)
);

CREATE TABLE vue_user.event(
   event_id INT,
   title VARCHAR(50) NOT NULL,
   description TEXT NOT NULL,
   event_date DATETIME NOT NULL,
   location VARCHAR(50) NOT NULL,
   capacity INT NOT NULL,
   status VARCHAR(50),
   PRIMARY KEY(event_id)
);

CREATE TABLE vue_user.condition_type(
   Id_condition_type COUNTER,
   label VARCHAR(50) NOT NULL,
   PRIMARY KEY(Id_condition_type)
);

CREATE TABLE vue_user.object_type(
   Id_object_type COUNTER,
   label VARCHAR(50) NOT NULL,
   PRIMARY KEY(Id_object_type)
);

CREATE TABLE vue_user.container(
   Id_Container COUNTER,
   adress VARCHAR(50) NOT NULL,
   city VARCHAR(50) NOT NULL,
   zipcode VARCHAR(5) NOT NULL,
   PRIMARY KEY(Id_Container)
);

CREATE TABLE vue_user.inscription(
   Id_inscription COUNTER,
   event_id INT NOT NULL,
   siren INT NOT NULL,
   PRIMARY KEY(Id_inscription),
   FOREIGN KEY(event_id) REFERENCES event(event_id),
   FOREIGN KEY(siren) REFERENCES company(siren)
);

CREATE TABLE vue_user.emplacement(
   Id_emplacement COUNTER,
   available LOGICAL,
   dimension VARCHAR(11),
   Id_Container INT NOT NULL,
   PRIMARY KEY(Id_emplacement),
   FOREIGN KEY(Id_Container) REFERENCES Container(Id_Container)
);

CREATE TABLE vue_user.listing(
   Id_item COUNTER,
   title VARCHAR(50) NOT NULL,
   description TEXT NOT NULL,
   dimension VARCHAR(11),
   date_posted DATE,
   status VARCHAR(50),
   Id_emplacement INT NOT NULL,
   siren INT NOT NULL,
   Id_object_type INT NOT NULL,
   Id_condition_type INT NOT NULL,
   PRIMARY KEY(Id_item),
   UNIQUE(Id_emplacement),
   FOREIGN KEY(Id_emplacement) REFERENCES emplacement(Id_emplacement),
   FOREIGN KEY(siren) REFERENCES company(siren),
   FOREIGN KEY(Id_object_type) REFERENCES object_type(Id_object_type),
   FOREIGN KEY(Id_condition_type) REFERENCES condition_type(Id_condition_type)
);

CREATE TABLE vue_user.listing_image(
   Id_listing_image COUNTER,
   image VARBINARY(255),
   Id_item INT NOT NULL,
   PRIMARY KEY(Id_listing_image),
   FOREIGN KEY(Id_item) REFERENCES listing(Id_item)
);

-- SCHEMA ADMIN
CREATE TABLE vue_admin.admin(
   admin_id INT,
   password VARCHAR(50) NOT NULL,
   rights JSON NOT NULL,
   PRIMARY KEY(admin_id)
);

CREATE TABLE vue_admin.article(
   Id_veille COUNTER,
   title VARCHAR(50) NOT NULL,
   article_date DATETIME,
   author VARCHAR(50) NOT NULL,
   content TEXT NOT NULL,
   image VARBINARY(50),
   admin_id INT NOT NULL,
   PRIMARY KEY(Id_veille),
   FOREIGN KEY(admin_id) REFERENCES admin(admin_id)
);

CREATE TABLE vue_admin.elearning_list(
   course_id VARCHAR(50),
   title VARCHAR(50),
   description TEXT NOT NULL,
   price VARCHAR(50),
   admin_id INT NOT NULL,
   PRIMARY KEY(course_id),
   FOREIGN KEY(admin_id) REFERENCES admin(admin_id)
);