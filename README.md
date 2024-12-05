# Cornell FinTech - FinTrack

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---

## Getting Started

### Prerequisites

To set up and run the project, you’ll need:

- Python 3.6+ and pip
- PostgreSQL and pgAdmin (for database management)
- Git for cloning the repository
- Flask CLI (comes with Flask installation)

### Installation

#### 1. Clone the repository
```bash
git clone git@github.com:ameliazhengg/FinTrack.git 
cd FinTrack
```

#### 2. Set Up the Backend

##### 2.1 Navigate to the `backend` directory:
```bash
cd backend
```

##### 2.2 Create a virtual environment:
```bash
python3 -m venv venv  
source venv/bin/activate  # On Windows, use venv\\Scripts\\activate
```

##### 2.3 Install dependencies:
```bash
pip install -r requirements.txt  
```

##### 2.4 Set Up the .env File

Create a `.env` file in the root directory with the following variable:
```bash
DATABASE_URI=postgresql+psycopg2://<YOUR_USER>:<YOUR_PASSWORD>@localhost:5432/<DATABASE_NAME>
POSTGRES_USER=<YOUR_USER>
POSTGRES_PASSWORD=<YOUR_PASSWORD>
POSTGRES_DB=<DATABASE_NAME>
```
REPLACE `<YOUR_USER>` with your Postgres user
REPLACE `<YOUR_PASSWORD>` with your Postgres password
REPLACE `<DATABASE_NAME>` with your database name (FinTrack is preferred)
* For SWEs: DO NOT PUSH THIS TO GITHUB, it is already specified in `.gitignore` MAKE SURE YOU NEVER PUSH THIS FILE!!!

##### 2.5 Set Up the Database:

###### 1 Open pgAdmin and create a new database with the name you specified in `DATABASE_URI`.

###### 2 After setting up your PostgreSQL database in pgAdmin, initialize the database by running the following Flask command:
```bash
flask db upgrade
```
This command will apply the initial database migrations and set up the database tables.
* Note, if there isn't already a `migrations` folder in the repo (there will be), run:
```bash
flask db init
```
before running upgrade

##### 2.6 Start the Flask Server
Start the backend server with:
```bash
python app.py
```
The Flask API should now be running at `http://127.0.0.1:5005`.

#### 3. Set Up the Frontend
##### 3.1 In another terminal tab, navigate to the `frontend` directory:
```bash 
cd ../frontend
```

##### 3.2 Install dependencies:
```bash
npm install
``` 

##### 3.3 Start the React development server:
```bash 
npm start
```  
The React app should now be running at `http://localhost:3000` and will automatically connect to the Flask backend.

---

## Database Migrations Guide (VERY IMPORTANT FOR SWEs)

### What Are Migrations?

Migrations are a way to **version-control database schema changes**. They allow us to manage incremental updates to the database structure safely and avoid issues such as data loss. This process is essential for ensuring that changes to `models.py` reflect in the database without having to drop tables or recreate data from scratch.

### How Migrations Work

Migrations use a combination of Python scripts and database commands to apply changes to your database tables based on changes made to the models in `models.py`. Flask-Migrate, which leverages SQLAlchemy, allows us to manage these changes seamlessly.

### Commands for Database Migrations

#### Generating a New Migration

When you make changes to `models.py`, such as adding or altering columns, generate a new migration script with:
```bash
flask db migrate -m "describe your changes here"
```

This command will create a migration file in the `migrations/versions` directory. Review this file to ensure it captures the intended changes.

#### Applying Migrations
Once the migration script is created and reviewed, apply it to the database with:
```bash
flask db upgrade
```
This command will update the database schema based on the migration script without deleting existing tables or data.

#### Rolling Back a Migration
If an applied migration introduces issues, you can revert the last migration using:
```bash
flask db downgrade
```
This command rolls back the most recent migration, undoing the changes it introduced. Use this cautiously, as it will remove any schema modifications from the latest migration. Rolling back should only be done when necessary, and ideally, migrations should be thoroughly reviewed and tested before upgrading.

---

#### Common Migrations Workflow

##### 1 Make Changes to `models.py`
Modify the models by adding, altering, or removing fields as needed for the database schema.

##### 2 Generate Migration
Run the following command to create a migration script that reflects your changes:
```bash
flask db migrate -m "describe your changes"
```
This will generate a new migration file in the `migrations/versions` directory, capturing the intended changes to the schema.

##### 3 Review Migration Script
Check the generated migration file to confirm it accurately reflects the changes made in `models.py`. Ensure no unintended alterations are present.

##### 4 Apply Migration
Run `flask db upgrade` to apply the migration to the database schema. This step should be done once you are confident that the migration script is accurate.

##### 5 Test and Validate
After applying the migration, test the database and application to verify that the changes were successful and did not introduce any issues.

##### 6 Rolling Back (If Necessary)
If any errors occur after a migration, use flask db downgrade to revert the changes. Make further adjustments as needed and repeat the process from Step 2.


