SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: Application Management
--
CREATE DATABASE IF NOT EXISTS applicationmanagement DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE applicationmanagement;

-- --------------------------------------------------------

--
-- Table structure for table Users
--

DROP TABLE IF EXISTS Users;
CREATE TABLE IF NOT EXISTS Users (
  id int(11) NOT NULL auto_increment,
  firstname varchar(125) NOT NULL,
  lastname varchar(125) NOT NULL,
  email varchar(255) NOT NULL ,
  password varchar(100) DEFAULT NULL,
  agency_email varchar(100) DEFAULT NULL,
  register_date datetime,
  is_delete boolean NOT NULL DEFAULT false ,
  role varchar(10) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table Applications
--

DROP TABLE IF EXISTS Applications;
CREATE TABLE IF NOT EXISTS Applications (
  id int(11) NOT NULL auto_increment,
  user_id int(11) NOT NULL,
  dept_name varchar(125) NOT NULL,
  register_date datetime,
  agency_mail varchar(125),
  stage varchar(255) NOT NULL ,
  is_delete boolean NOT NULL DEFAULT false ,
  interview_req varchar(250),
  PRIMARY KEY (id),
  UNIQUE (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table Rejected Applications
--

DROP TABLE IF EXISTS rejected_applications;
CREATE TABLE IF NOT EXISTS rejected_applications (
  id int(11) NOT NULL auto_increment,
  app_id int(11) NOT NULL ,
  reject_reason varchar(125) NOT NULL,
  reject_date datetime not null,
  is_delete boolean NOT NULL DEFAULT false ,
  PRIMARY KEY (id),
  UNIQUE (app_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table Approved Applications
--

DROP TABLE IF EXISTS approved_applications;
CREATE TABLE IF NOT EXISTS approved_applications (
  id int(11) NOT NULL auto_increment,
  app_id int(11) NOT NULL ,
  scholarship int(5) NOT NULL,
  is_approve boolean NOT NULL DEFAULT true ,
  reject_date datetime not null,
  is_delete boolean NOT NULL DEFAULT false ,
  PRIMARY KEY (id),
  UNIQUE (app_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table Course
--

DROP TABLE IF EXISTS Course;
CREATE TABLE IF NOT EXISTS Course (
  id int(11) NOT NULL auto_increment,
  name varchar(125) NOT NULL,
  dept_name varchar(125) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table App_Course
--

DROP TABLE IF EXISTS app_course;
CREATE TABLE IF NOT EXISTS app_course (
  id int(11) NOT NULL auto_increment,
  app_id int(11) NOT NULL,
  course_id int(11) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table Document
--

DROP TABLE IF EXISTS Document;
CREATE TABLE IF NOT EXISTS Document (
  id int(11) NOT NULL auto_increment,
  app_id int(11) NOT NULL,
  name varchar(125) NOT NULL,
  is_approve boolean NOT NULL DEFAULT false ,
  update_date datetime not null,
  is_delete boolean NOT NULL DEFAULT false ,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- ALTER TABLE PART FOR FOREIGN KEY CONSTRAINTS --

  -- --------------------------------------------------------

--
-- Alter Table for table Applications 
--
ALTER TABLE Applications
  ADD CONSTRAINT fk_application_users FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE ON UPDATE CASCADE;
  
    -- --------------------------------------------------------

--
-- Alter Table for table Document 
--
ALTER TABLE Document
  ADD CONSTRAINT fk_document_application FOREIGN KEY (app_id) REFERENCES Applications (id) ON DELETE CASCADE ON UPDATE CASCADE;
  
      -- --------------------------------------------------------

--
-- Alter Table for table approved_applications 
--
ALTER TABLE approved_applications
  ADD CONSTRAINT fk_apr_application FOREIGN KEY (app_id) REFERENCES Applications (id) ON DELETE CASCADE ON UPDATE CASCADE;
  
        -- --------------------------------------------------------

--
-- Alter Table for table rejected_applications 
--
ALTER TABLE rejected_applications
  ADD CONSTRAINT fk_rjc_application FOREIGN KEY (app_id) REFERENCES Applications (id) ON DELETE CASCADE ON UPDATE CASCADE;
  
          -- --------------------------------------------------------

--
-- Alter Table for table App_Course 
--
ALTER TABLE app_course
  ADD CONSTRAINT fk_appcourse_appapplication FOREIGN KEY (app_id) REFERENCES approved_applications (app_id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT fk_appcourse_course FOREIGN KEY (course_id) REFERENCES Course (id) ON DELETE CASCADE ON UPDATE CASCADE;


