from flask import Flask, render_template, request, jsonify
import os
import tensorflow as tf
import numpy as np
from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import io

# Use a non-GUI backend for Matplotlib
plt.switch_backend('Agg')

# Initialize Flask app
app = Flask(__name__)

# Paths for static assets
UPLOAD_FOLDER = './static/uploads/'
GENERATED_FOLDER = './static/generated/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GENERATED_FOLDER, exist_ok=True)

# Load the trained generator model
GENERATOR_MODEL_PATH = 'generator.keras'
generator = tf.keras.models.load_model(GENERATOR_MODEL_PATH)

def generate_image_grid(generator, num_images=10):
    """Generate a grid of images using the GAN model."""
    noise = np.random.normal(0, 1, (num_images, 100))  # Random noise
    generated_images = generator.predict(noise)  # Generate images
    generated_images = (generated_images + 1) / 2.0  # Rescale to [0, 1]

    # Create a grid of generated images
    rows = 1
    cols = num_images
    fig, axes = plt.subplots(rows, cols, figsize=(12, 4))

    for i, ax in enumerate(axes.flat):
        ax.imshow(generated_images[i].reshape(28, 28), cmap='gray')  # Reshape to 28x28
        ax.axis('off')

    plt.tight_layout(rect=[0, 0, 1, 0.95])

    # Save the grid image to a buffer
    buffer = io.BytesIO()
    canvas = FigureCanvas(fig)
    canvas.print_png(buffer)
    buffer.seek(0)
    plt.close(fig)

    # Save the buffer as a static file
    image_path = os.path.join(GENERATED_FOLDER, 'generated_image_grid.png')
    with open(image_path, 'wb') as f:
        f.write(buffer.getvalue())
    return image_path

@app.route('/')
def index():
    """Render the frontend."""
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    """Handle file upload and trigger image generation."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save uploaded file
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    # Trigger image generation
    generated_image_path = generate_image_grid(generator)

    # Return the generated image path
    return jsonify({'generated_image_url': generated_image_path})

if __name__ == '__main__':
    app.run(debug=True)
