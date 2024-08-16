# iCareConnec+ Platform

Built on top of OpenMRS, an Open source Medical Records System and a Global Public Good. iCareConnec+ platform takes advantage of System and the global community support provided around the OpenMRS.

The platform expose APIs for missing services like Billing, Inventory, Laboratory Process etc. The extensive APIs for Billing, Laboratory and Invotory services have made the platform to be able to pruduce EMR meeting Tanzania and African countries EMRs Systems standards, laboratory system standard, pharmacy based or point of sell systems

## Components of the platform

iCareConnec+ platform offers the following major module

### Electronic Medical Records (EMRs)

iCareConnec+ platform was built with the aim of coming up with EMRs Solution. This is the default feature of the platform.

### Laboratory Information System

iCareConnec+ has been able to produce Laboratory Information System for the Tanzania National Public Health Laboratory.

### Pharmacy Information System

The comprehensive Store/Inventory management and dispensing has made it possible for the platform to support Pharmacy based Information System.

## Prerequisites - Development

1. [NodeJs (10 or higher)](https://nodejs.org)
2. npm (6.4.0 or higher), can be installed by running `apt install npm`
3. git, can be installed by running `apt install git`

## Setup

Clone repository

```bash
 git clone https://github.com/udsm-dhis2-lab/icare.git
```

Navigate to application root folder

```bash
cd icare/ui
```

Install all required dependencies for the app

```bash
npm install
```

## Development server

Duplicate proxy-config.example.json and rename the copied file to proxy-config.json

Copy the following and paste it to the file proxy-config.json

```bash
{
  "/": {
    "target":"https://icare.dhis2.udsm.ac.tz",
    "secure": "false",
    "changeOrigin": "true"
  }
}
```

Start the development server

```bash
npm start
```

Navigate to [http://localhost:4200](http://localhost:4200)

## Build

After making the changes to the backend we build the application so that the omod contains the backend changes by following the steps below:

Navigate to application root folder

```bash
cd omods/core
```

Run the following command to build the application

```bash
mvn clean package -DskipTests
```

Upload the omod to openmrs.

## Running unit tests

## Running end-to-end tests

## Further help
# messaging
