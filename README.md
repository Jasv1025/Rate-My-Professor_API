# Professor Info Scraper API

This project provides a RESTful API that retrieves professor information by scraping external sources. It integrates a Python Flask API with a Node.js Puppeteer scraper, and is containerized using Docker for ease of deployment.

## Features

- Flask-based HTTP API (`/professor?name=...`)
- Headless web scraping via Puppeteer (Node.js)
- Cross-language communication using Python's `subprocess` module
- CORS support for web frontend compatibility
- Dockerized architecture for consistent setup

## Prerequisites

- Docker
- Docker Compose

## Running the Project

To build and run the application:

```bash
docker-compose up --build
```

The Flask API will be available at:

```
http://localhost:5000/professor?name=John+Smith
```

## Project Structure

```
.
├── app.py                  # Main Flask API
├── requirements.txt        # Python dependencies
├── Dockerfile              # API container definition
├── puppeteer_scraper/
│   ├── index.js            # Puppeteer scraping script
│   └── package.json        # Node.js dependencies
├── docker-compose.yaml     # Multi-container setup
└── README.md
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.