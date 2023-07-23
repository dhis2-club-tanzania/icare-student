# iCare

## Prerequisites

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

To run the ICARE SMS SRERVER run node server to terminal of icare sms code

to connect with the mongo db database

Then write the number on the UI page of the Icare by writing the phone number

then sms is sent on specific number with respective message wrote from the server code

To access the labour pattern graph open the code on the IDE then run ng serve
