DROP DATABASE IF EXISTS vue_user;

-- Création des bases de données
CREATE DATABASE vue_user;

-- Utilisation de la base de données vue_user
USE vue_user;

-- Création des tables pour le schéma vue_user
CREATE TABLE company (
   siren CHAR(14) NOT NULL,
   nom VARCHAR(50) NOT NULL,
   email VARCHAR(75) NOT NULL,
   password VARCHAR(75) NOT NULL,
   adress VARCHAR(255) NOT NULL,
   zipcode VARCHAR(5) NOT NULL,
   city VARCHAR(50) NOT NULL,
   phone VARCHAR(10) NOT NULL,
   token VARCHAR(255) DEFAULT NULL,
   active BOOL DEFAULT 0,
   joined  DATE DEFAULT NULL,
   profile_picture LONGBLOB DEFAULT NULL,
   PRIMARY KEY(siren)
);

CREATE TABLE preference (
   id_preference INT AUTO_INCREMENT,
   preference JSON NOT NULL,
   notif JSON NOT NULL,
   info JSON NOT NULL,
   siren CHAR(14) NOT NULL,
   PRIMARY KEY(id_preference),
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

CREATE TABLE category (
	id INT auto_increment NOT NULL,
	Libelle varchar(50) NOT NULL,
	CONSTRAINT category_pk PRIMARY KEY (id)
);

CREATE TABLE elearning (
   id_elearning INT AUTO_INCREMENT,
   title VARCHAR(75) NOT NULL,
   description TEXT NOT NULL,
   price INT NOT NULL,
   subscription_date DATE NOT NULL,
   token VARCHAR(75),
   password VARCHAR(75),
   course_id INT,
   siren CHAR(14) NOT NULL,
   category int NOT NULL DEFAULT '1',
   favorite BOOLEAN DEFAULT 0, 
   PRIMARY KEY(id_elearning),
   FOREIGN KEY(siren) REFERENCES company(siren),
   FOREIGN KEY(category) REFERENCES category(id)
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
   id_condition_type INT AUTO_INCREMENT,
   label VARCHAR(50) NOT NULL,
   PRIMARY KEY(id_condition_type)
);

CREATE TABLE object_type (
   id_object_type INT AUTO_INCREMENT,
   label VARCHAR(50) NOT NULL,
   PRIMARY KEY(id_object_type)
);

CREATE TABLE container (
   id_Container INT AUTO_INCREMENT,
   adress VARCHAR(50) NOT NULL,
   city VARCHAR(50) NOT NULL,
   zipcode VARCHAR(5) NOT NULL,
   capacity INT NOT NULL,
   PRIMARY KEY(id_Container)
);

CREATE TABLE inscription (
   id_inscription INT AUTO_INCREMENT,
   event_id INT NOT NULL,
   siren CHAR(14) NOT NULL,
   PRIMARY KEY(id_inscription),
   FOREIGN KEY(event_id) REFERENCES event(event_id),
   FOREIGN KEY(siren) REFERENCES company(siren)
);

CREATE TABLE emplacement (
   id_emplacement INT AUTO_INCREMENT,
   available BOOLEAN,
   dimension VARCHAR(11),
   id_Container INT NOT NULL,
   PRIMARY KEY(id_emplacement),
   FOREIGN KEY(id_Container) REFERENCES container(id_Container)
);

CREATE TABLE listing (
   id_item INT AUTO_INCREMENT,
   title VARCHAR(50) NOT NULL,
   description TEXT NOT NULL,
   dimension VARCHAR(11),
   date_posted DATE,
   status VARCHAR(50),
   id_emplacement INT,
   siren CHAR(14) NOT NULL,
   id_object_type INT NOT NULL,
   id_condition_type INT NOT NULL,
   PRIMARY KEY(id_item),
   FOREIGN KEY(id_emplacement) REFERENCES emplacement(id_emplacement),
   FOREIGN KEY(siren) REFERENCES company(siren),
   FOREIGN KEY(id_object_type) REFERENCES object_type(id_object_type),
   FOREIGN KEY(id_condition_type) REFERENCES condition_type(id_condition_type)
);

CREATE TABLE listing_favorites (
  id_fav int NOT NULL AUTO_INCREMENT,
  id_item int NOT NULL,
  siren char(14) NOT NULL,
  PRIMARY KEY (`id_fav`),
  KEY listing_favorites_listing_FK (id_item),
  KEY listing_favorites_company_FK (siren),
  CONSTRAINT listing_favorites_company_FK FOREIGN KEY (siren) REFERENCES company(siren) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT listing_favorites_listing_FK FOREIGN KEY (id_item) REFERENCES listing (id_item) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE listing_image (
   id_listing_image INT AUTO_INCREMENT,
   image LONGBLOB,
   id_item INT NOT NULL,
   mime_type VARCHAR(15),
   PRIMARY KEY(id_listing_image),
   FOREIGN KEY(id_item) REFERENCES listing(id_item)
);

CREATE TABLE transaction(
   id_transaction INT AUTO_INCREMENT,
   status VARCHAR(50),
   date_transaction DATETIME NOT NULL,
   id_item INT,
   siren CHAR(14) NOT NULL,
   PRIMARY KEY(id_transaction),
   FOREIGN KEY(id_item) REFERENCES listing(id_item),
   FOREIGN KEY(siren) REFERENCES company(siren)
);

DROP DATABASE IF EXISTS vue_admin;
CREATE DATABASE vue_admin;
-- Utilisation de la base de données vue_admin
USE vue_admin;

-- Création des tables pour le schéma vue_admin
CREATE TABLE admin (
   admin_id INT,
   password VARCHAR(75) NOT NULL,
   rights JSON NOT NULL,
   PRIMARY KEY(admin_id)
);

CREATE TABLE article (
   id_veille INT AUTO_INCREMENT,
   title VARCHAR(75) NOT NULL,
   article_date DATETIME,
   author VARCHAR(75) NOT NULL,
   content TEXT NOT NULL,
   image LONGBLOB DEFAULT NULL,
   category int NOT NULL,
   admin_id INT NOT NULL,
   PRIMARY KEY(id_veille),
   FOREIGN KEY(admin_id) REFERENCES admin(admin_id)
);

CREATE TABLE elearning_list (
   course_id INT,
   title VARCHAR(75),
   description TEXT NOT NULL,
   price VARCHAR(50),
   category int NOT NULL,
   admin_id INT NOT NULL,
   PRIMARY KEY(course_id),
   FOREIGN KEY(admin_id) REFERENCES admin(admin_id)
);

CREATE TABLE event (
   id_event INT AUTO_INCREMENT,
   title VARCHAR(50) NOT NULL,
   description TEXT NOT NULL,
   event_date DATETIME NOT NULL,
   location VARCHAR(50) NOT NULL,
   capacity INT,
   status VARCHAR(50) NOT NULL,
   admin_id INT NOT NULL,
   PRIMARY KEY(id_event),
   FOREIGN KEY(admin_id) REFERENCES admin(admin_id)
);

DROP DATABASE IF EXISTS payment_data;

-- Création des bases de données
CREATE DATABASE payment_data;

-- Utilisation de la base de données bank_data
USE payment_data;

-- Création des tables pour le schéma bank_data
CREATE TABLE payment_cards (
    id SERIAL PRIMARY KEY,
    card_name VARCHAR(100) NOT NULL,       -- Nom donné à la carte (ex: "Carte Pro")
    card_holder_first_name VARCHAR(50),   -- Prénom sur la carte
    card_holder_last_name VARCHAR(50),    -- Nom sur la carte
    encrypted_card_number VARCHAR(255), -- Numéro de carte (chiffré)
    expiration_date DATE NOT NULL,        -- Date d'expiration (format: YYYY-MM-DD)
    siren CHAR(14),                  -- SIREN auquel appartient la carte
    is_default BOOLEAN DEFAULT FALSE,     -- Carte par défaut
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    encryption_key VARCHAR(255) -- Numéro de carte (chiffré)
);