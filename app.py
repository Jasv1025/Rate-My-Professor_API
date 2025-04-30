# Import necessary modules from Flask
from flask import Flask, request, jsonify
from flask_cors import CORS

# Standard libraries
import subprocess  # For running the Puppeteer scraper
import json        # For parsing JSON output from the scraper

# Create a Flask application instance
app = Flask(__name__)

# Enable Cross-Origin Resource Sharing (CORS) for all routes
CORS(app)

# Define a route to handle GET requests for professor information
@app.route("/professor")
def get_professor():
    # Retrieve the 'name' query parameter from the URL
    name = request.args.get("name")
    if not name:
        return jsonify({"error": "No professor name provided"}), 400

    try:
        print("Running Puppeteer subprocess for:", name)
        
        # Run the Node.js Puppeteer script as a subprocess
        result = subprocess.run(
            ["node", "index.js", name],
            capture_output=True, text=True, check=True,
            cwd="puppeteer_scraper"
        )

        # Read and clean up the output
        output = result.stdout.strip()
        if not output:
            return jsonify({"error": "No data returned from scraper"}), 500

        try:
            # Parse the JSON output from the scraper and return it
            prof_data = json.loads(output)
            return jsonify(prof_data)
        except json.JSONDecodeError:
            # Handle JSON parsing errors
            return jsonify({"error": "Invalid JSON", "details": output}), 500

    except subprocess.CalledProcessError as e:
        # Handle errors when the subprocess fails (e.g., script crashes)
        return jsonify({"error": "Scraping failed", "details": e.stderr}), 500

# Run the Flask development server when executed directly
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)