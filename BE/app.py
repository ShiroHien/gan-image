from flask import Flask, render_template, request, jsonify
import os
import tensorflow as tf
import numpy as np
from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import io
import uuid
from test_function import test
from flask_cors import CORS, cross_origin

# use a non-gui backend for Matplotlib
plt.switch_backend('Agg')

app = Flask(__name__)
cors = CORS(app) # allow CORS for all domains on all routes.
app.config['CORS_HEADERS'] = 'Content-Type'

UPLOAD_FOLDER = './static/uploads/'
GENERATED_FOLDER = './static/generated/'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(GENERATED_FOLDER, exist_ok=True)

# load the trained generator model
GENERATOR_MODEL_PATH = 'generator.keras'
generator = tf.keras.models.load_model(GENERATOR_MODEL_PATH)

def generate_image_grid(generator, num_images=10):
    """Generate a grid of images using the GAN model."""
    noise = np.random.normal(0, 1, (num_images, 100))  
    generated_images = generator.predict(noise)  
    generated_images = (generated_images + 1) / 2.0  

    # create a grid of generated images
    rows = 1
    cols = num_images
    fig, axes = plt.subplots(rows, cols, figsize=(12, 4))

    for i, ax in enumerate(axes.flat):
        ax.imshow(generated_images[i].reshape(28, 28), cmap='gray')  # Reshape to 28x28
        ax.axis('off')

    plt.tight_layout(rect=[0, 0, 1, 0.95])

    buffer = io.BytesIO()
    canvas = FigureCanvas(fig)
    canvas.print_png(buffer)
    buffer.seek(0)
    plt.close(fig)

    unique_filename = f"generated_image_grid_{uuid.uuid4().hex}.png"
    image_path = os.path.join(GENERATED_FOLDER, unique_filename)

    # save the buffer as a static file
    with open(image_path, 'wb') as f:
        f.write(buffer.getvalue())
    return image_path

@app.route('/')
def index():
    """Render the frontend."""
    return render_template('index.html')

@app.route('/upload-old', methods=['POST'])
def upload_old():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400  

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400  

    filename = secure_filename(file.filename) 
    file_path = os.path.join(UPLOAD_FOLDER, filename)  
    file.save(file_path)

    generated_image_path = generate_image_grid(generator) 

    uploaded_image_url = os.path.join(UPLOAD_FOLDER, filename) 
    generated_image_url = generated_image_path 

    return jsonify({
        'uploaded_image_url': uploaded_image_url,
        'generated_image_url': generated_image_url
    })
    
@app.route('/upload', methods=['POST'])
@cross_origin()
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400  

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400  

    filename = secure_filename(file.filename) 
    file_path = os.path.join(UPLOAD_FOLDER, filename)  
    file.save(file_path)

    output_file_name = test(file_path) 
    generated_image_path = os.path.join(GENERATED_FOLDER, output_file_name)

    uploaded_image_url = os.path.join(UPLOAD_FOLDER, filename) 
    generated_image_url = generated_image_path 
    
    print("uploaded_image_url: ", uploaded_image_url)
    print("generated_image_url: ", generated_image_url)

    return jsonify({
        'uploaded_image_filename': filename,
        'generated_image_filename': output_file_name
    })

if __name__ == '__main__':
    app.run(debug=True)
