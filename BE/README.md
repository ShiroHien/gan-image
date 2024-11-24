# Requirements

- Python 3
- Flask

# Local Run

## Windows (need to have python 3.9)

Create a virtual env (mandatory): https://docs.python-guide.org/dev/virtualenvs/#virtualenvironments-ref
pip install virtualenv
virtualenv venv
.\venv\Scripts\activate

Install requirements:
pip install -r requirements.txt

Run the Application:
flask run
The app will be running at http://127.0.0.1:5000.

Test the API:

- Drag or Choose photos from FE page
- The photo will be stored in static/uploads folder

# Docker Run

Build the Docker Image:
docker build -t gan-app .

Run the Docker Container:
docker run -p 5000:5000 gan-app
This will make the application accessible on http://localhost:5000.

Test the API in Docker:

- Drag or Choose photos from FE page
- The photo will be stored in static/uploads folder
