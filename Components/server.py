from flask import Flask, request, jsonify
from PIL import Image
import io
import base64
from flask_cors import CORS 

app = Flask(__name__)
CORS(app) 

# Route to handle image resizing
@app.route('/resize-image', methods=['POST'])
def resize_image():
    try:
        # Get the Base64 image from the request
        data = request.json['image_base64']
        dimension_list=request.json['dimentionVal']
        resized_images={}
    
        
        # Decode the Base64 image
        image_data = base64.b64decode(data.split(',')[1])
        image = Image.open(io.BytesIO(image_data))

        if len(dimension_list)>1:
          
             for i, dimensions in enumerate(dimension_list):
                  file_name=['Instagram','Facebook', 'Twitter','LinkedIn']
                  width, height = int(dimensions[0]), int(dimensions[1])
                  resized_image = image.resize((width, height))
            
                  # Save the resized image to a byte buffer
                  buffer = io.BytesIO()
                  resized_image.save(buffer, format="PNG")
                  buffer.seek(0)

                  resized_image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

                  # Store the resized image in the dictionary with a unique key
                  resized_images[file_name[i]] = f"data:image/png;base64,{resized_image_base64}"

        else:
            width, height = int(dimension_list[0][0]), int(dimension_list[0][1])
            resized_image = image.resize((width, height))
            
            # Save the resized image to a byte buffer
            buffer = io.BytesIO()
            resized_image.save(buffer, format="PNG")
            buffer.seek(0)

            resized_image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')

            # Store the resized image in the dictionary with a unique key
            resized_images["resized_image"] = f"data:image/png;base64,{resized_image_base64}"

       
    
        return jsonify(resized_images)

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
