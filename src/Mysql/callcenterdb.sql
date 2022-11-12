drop database callcenterdb;

CREATE DATABASE CallCenterDB;

Use CallCenterDB;
	CREATE TABLE CallCenterDB.Users (
		User_ID			INT PRIMARY KEY AUTO_INCREMENT
		,Phone					VARCHAR(11) NOT NULL
		,Fullname				VARCHAR(128) NOT NULL
		,Date_of_birth			DATE NOT NULL
		,UNIQUE (Phone)
        );	

	CREATE TABLE CallCenterDB.Passengers (
		Passenger_ID			INT PRIMARY KEY AUTO_INCREMENT
		,Email					VARCHAR(128)
		,Phone					VARCHAR(11)
		,Password				VARCHAR(100)
		,Fullname				VARCHAR(128) NOT NULL
		,Date_of_birth			VARCHAR(11)
		,role					VARCHAR(100) DEFAULT 'ROLE_PASSENGER'
		,UNIQUE (Phone)
        ,unique (Email) 
        );	    
        
		CREATE TABLE CallCenterDB.Drivers (    
		Driver_ID					INT 
		,Car_owner					VARCHAR(128) NOT NULL
		,Car_type					VARCHAR(128) NOT NULL
		,Car_code					VARCHAR(128) NOT NULL
		,Car_seat					INT NOT NULL
		,Car_color					VARCHAR(128) NOT NULL
        , primary key (Driver_ID)
        ,FOREIGN KEY (Driver_ID) REFERENCES Passengers(Passenger_ID)
	);
    	

	CREATE TABLE CallCenterDB.Journeys (
		Journeys_ID					INT PRIMARY KEY AUTO_INCREMENT
		,Passenger_ID					INT
		,Driver_ID 						INT
		,User_ID						INT
		,start_time 					DATETIME DEFAULT NOW()
		,finish_time 					DATETIME
		,Price							BIGINT
		,origin_Id						VARCHAR(2048)
		,origin_Fulladdress				VARCHAR(256)
		,destination_Id					VARCHAR(2048)
		,destination_Fulladdress		VARCHAR(256)
		,Status 						VARCHAR(128) default 'Create'
		,pointCode						VARCHAR(4096)
		,distance_km					double
		,SupportStaff_ID				INT
        , foreign key (Driver_ID) references Drivers(Driver_ID)
        , foreign key (Passenger_ID) references Passengers(Passenger_ID)
		, foreign key (User_ID) references Users(User_ID)
	);

	
    CREATE TABLE CallCenterDB.Online_Driver (
	ID		INT PRIMARY KEY AUTO_INCREMENT
    ,Driver_ID		INT
    ,LNG			DOUBLE
    ,LAT			DOUBLE
    ,Car_seat		INT NOT NULL default 4
    ,UNIQUE (Driver_ID)
    ,Status		VARCHAR(100) default 'Offline'
    ,foreign key (Driver_ID) references Drivers(Driver_ID)    
    )