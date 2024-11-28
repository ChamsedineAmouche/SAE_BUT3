-- vue_admin
USE vue_admin;

INSERT INTO vue_admin.admin (admin_id,password,rights) VALUES
	 (77939440,'sympamec','{"all": "True"}');

INSERT INTO vue_admin.event (title,description,event_date,location,capacity,status,admin_id) VALUES
	 ('Event 1','Lorem Ipsum','2024-02-01 15:15:01','Online',10,'Cancelled',77939440),
	 ('Event 2','Lorem Ipsum','2024-02-03 10:15:01','Online',15,'Incoming',77939440),
	 ('Event 3','Lorem Ipsum','2024-02-02 23:30:01','Online',10,'Full',77939440);

INSERT INTO vue_admin.elearning_list (course_id,title,description,price,admin_id) VALUES
	 ('1','''Exemple 1''','Lorem Ipsum Vitae','10',77939440),
	 ('2','''Exemple 2''','Lorem Ipsum Vitae','10',77939440),
	 ('3','''Exemple 3''','Lorem Ipsum Vitae','10',77939440),
	 ('4','''Exemple 4''','Lorem Ipsum Vitae','0',77939440),
	 ('5','''Exemple 5''','Lorem Ipsum Vitae','0',77939440),
	 ('6','''Exemple 6''','Lorem Ipsum Vitae','0',77939440),
	 ('7','''Exemple 7''','Lorem Ipsum Vitae','0',77939440),
	 ('8','''Exemple 8''','Lorem Ipsum Vitae','3',77939440);


-- vue_user
USE vue_user;

INSERT INTO vue_user.company (siren,nom,email,password,adress,zipcode,city,phone) VALUES
	 ('18770918300235','CCI 77 ','cci77@gmail.com','3,@|zEM5&F92','1 AVENUE JOHANNES GUTENBERG','77700','Serris','0939232929'),
	 ('33865714102081','Ada Location','ada.location@gmail.com','uO830|Tkqd6{','1 BOULEVARD MICHAEL FARADAY','77700','Serris','0699099143'),
	 ('39966767400051','Andreu','andreu@gmail.com','3,@|zEM5&F92','1 BD RUE IRENE JOLIOT CURIE','77700','Bailly-Romainvilliers','0728283283'),
	 ('48830276100090','Ludendo','lundendo@gmail.com','Z?_%Sa4541F5','2 Avenue Clement Ader','77700','Serris','0743378238'),
	 ('78496197100305','SIMT - Médecine du travail','SIMT@gmail.com','A534<.w9LeQB','4 avenue Christian Doppler','77700','SerrIs','0677908733'),
	 ('80503352900027','La Grande Papet','LGP@gmail.com','TU|q}013m=~{','2 avenue Christian Doppler','77700','Serris','0928832838'),
	 ('85003138000500','SESSAD Passerose','sessad@gmail.com','3,@|zEM5&F92','2 avenue Christian Doppler','77700','Serris','0164171400');

INSERT INTO vue_user.condition_type (label) VALUES
	 ('Satisfaisant'),
	 ('Bon état'),
	 ('Très bon état'),
	 ('Neuf');

INSERT INTO vue_user.container (adress,city,zipcode,capacity) VALUES
	 ('1 BOULEVARD MICHAEL FARADAY','Serris','77700',5);

INSERT INTO vue_user.emplacement (available,dimension,id_Container) VALUES
	 (1,NULL,1),
	 (1,NULL,1),
	 (1,NULL,1),
	 (1,NULL,1),
	 (1,NULL,1);

INSERT INTO vue_user.event (event_id,title,description,event_date,location,capacity,status) VALUES
(1,'Event 1','Lorem Ipsum','2024-02-01 15:15:01','Online',10,'Cancelled'),
(2,'Event 2','Lorem Ipsum','2024-02-03 10:15:01','Online',15,'Incoming'),
(3,'Event 3','Lorem Ipsum','2024-02-02 23:30:01','Online',10,'Full');

INSERT INTO vue_user.object_type (label) VALUES
    ('Informatique'),
    ('Bureautique'),
    ('Meuble'),
    ('Papetterie'),
    ('Décoration'),
    ('Outils'),
    ('Autres');

