-- my_project.`user` definition

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `password` text NOT NULL,
  `username` varchar(15) NOT NULL,
  `create_dt` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;


-- my_project.awards definition

CREATE TABLE `awards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `awards_nm` text NOT NULL,
  `awards_desc` text NOT NULL,
  `awards_ins_date` date DEFAULT NULL,
  `awards_udt_date` date DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `awards_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;


-- my_project.edu definition

CREATE TABLE `edu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `edu_sc_nm` text NOT NULL,
  `edu_major` text NOT NULL,
  `edu_gd_ck` int(11) DEFAULT NULL,
  `edu_ins_date` date DEFAULT NULL,
  `edu_udt_date` date DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `edu_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;


-- my_project.license definition

CREATE TABLE `license` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `license_nm` text NOT NULL,
  `license_get_date` text NOT NULL,
  `license_issuing_org` date DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `license_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;


-- my_project.project definition

CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_nm` text NOT NULL,
  `project_desc` text NOT NULL,
  `project_st` date DEFAULT NULL,
  `project_et` date DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;