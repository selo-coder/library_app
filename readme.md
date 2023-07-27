# Library-App

The Library-App is a platform that enables users to create and share posts on a wide range of subjects and topics. Each subject is comprised of multiple specific topics, such as "Rome" or "The First World War" within the subject of history. Users have the ability to create posts related to these specific topics.

<br />

## Development Setup

Before getting started with the development, please ensure that you have Docker, Node.js, and Python 3 installed on your system. Once you have installed these dependencies, follow the three steps below:

<br />

## Step 1 - MySQL Database

To set up the MySQL database, execute the following command:

```bash
docker-compose up -d library-app-database
```

Once the Docker container is up and running, the database is ready to be used. You can also access the database directly using the following command:

```bash
docker exec -it library_app-library-app-database-1 /bin/bash
```

To log in to the database, use the following command:

```bash
mysql -u Root_User -p
```

The password is: passw0rd

<br />

## Step 2 - Python / Flask Backend

To set up the Flask backend, follow these steps:

Install all dependencies by running the following command:

```bash
python -m pip install -r requirements.txt
```

Start the Python script from the backend folder:

```bash
python .\library_api.py
```

<br />

## Step 3 - ReactJS Frontend

To set up the ReactJS frontend, follow these steps:

Install all dependencies by running the following command:

```bash
npm install
```

Start the ReactJS frontend from the frontend folder:

```bash
npm run start
```

<br />

After completing these steps, you can access the web application for development at:

```bash
localhost:3000
```

<br />

## Non-Dev Setup

If you only want to test the software, Docker is the only dependency you need. You can set up the frontend, backend, and database with a single command:

```bash
docker compose up
```

You can access the web application for testing at:

```bash
localhost:3000
```

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
