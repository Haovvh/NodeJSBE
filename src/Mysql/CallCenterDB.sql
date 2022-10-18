select * from callcenterdb.cars;
drop database callcenterdb;

CREATE DATABASE CallCenterDB;

Use CallCenterDB;
	CREATE TABLE CallCenterDB.Users (
		User_ID			INT PRIMARY KEY AUTO_INCREMENT
		,User_Phone		VARCHAR(11)
		,User_Name			VARCHAR(128)
		,Date_of_birth			DATE
		,UNIQUE (Passenger_Phone)
        );

	CREATE TABLE CallCenterDB.Passengers (
		Passenger_ID			INT PRIMARY KEY AUTO_INCREMENT
		,Passenger_Email		VARCHAR(128)
		,Passenger_Phone		VARCHAR(11)
		,Passenger_Pass			VARCHAR(50)
		,Passenger_Name			VARCHAR(128)
		,Date_of_birth			DATE
        ,Roles					VARCHAR(50)
		,UNIQUE (Passenger_Phone)
        ,unique (Passenger_Email) 
        );
        
	
	CREATE TABLE CallCenterDB.Cars (
		Cars_ID						INT PRIMARY KEY AUTO_INCREMENT
		,Car_owner					VARCHAR(128)
		,Car_type					VARCHAR(128)
		,Car_code					VARCHAR(128)
		,Car_seat					INT
		,Car_color					VARCHAR(128)
        
	);

	CREATE TABLE CallCenterDB.Drivers (    
		Driver_ID					INT 
		,Car_ID						INT
        , primary key (Driver_ID, Car_ID)
        ,FOREIGN KEY (Driver_ID) REFERENCES Passengers(Passenger_ID)
        ,FOREIGN KEY (Car_ID) REFERENCES Cars(Cars_ID)
	);
    

	CREATE TABLE CallCenterDB.Locations (
		Location_ID					INT PRIMARY KEY AUTO_INCREMENT
		,Location_FullName			VARCHAR(256)
		,Place_id 					VARCHAR(128)
		,LNG						FLOAT
		,LAT						FLOAT
        ,unique (Place_id)
	);

	CREATE TABLE CallCenterDB.Journeys (
		Journeys_ID					INT PRIMARY KEY AUTO_INCREMENT
		,Passenger_ID					INT
		,Driver_ID 						INT
		,start_time 					DATETIME
		,finish_time 					DATETIME
		,Price							BIGINT
		,LocationID_FROM				INT
		,LocationID_TO					INT
		,Journey_statusId 				VARCHAR(128)
		,Journey_pointCode				VARCHAR(256)
		,distance_km					double
		,SupportStaff_ID				INT
        , foreign key (Driver_ID) references Drivers(Driver_ID)
        , foreign key (Passenger_ID) references Passengers(Passenger_ID)
		, foreign key (SupportStaff_ID) references Passengers(Passenger_ID)
	);

	CREATE TABLE CallCenterDB.Journey_status (
		status_ID					INT PRIMARY KEY AUTO_INCREMENT
		,Status_Description	 			VARCHAR(256)
	);
    CREATE TABLE CallCenterDB.Online_Driver (
    Driver_ID		INT PRIMARY KEY
    ,LNG			DOUBLE
    ,LAT			DOUBLE
    ,Status_ID		INT
    ,foreign key (Driver_ID) references Drivers(Driver_ID)
    
    )

