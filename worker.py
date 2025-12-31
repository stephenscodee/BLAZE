import json
import time
import redis
import requests
import uuid
from PIL import Image
import io
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:3000")
S3_BUCKET = os.getenv("S3_BUCKET", "blaze-generations")

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0)

def generate_mock_image(prompt):
    """Simulates image generation and returns a dummy image as bytes."""
    # In a real scenario, this would call Stable Diffusion or FLUX
    img = Image.new('RGB', (512, 512), color = (73, 109, 137))
    # We could even paste some text or colors based on the prompt
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    return img_byte_arr.getvalue()

def upload_to_s3(image_bytes, filename):
    """Simulates S3 upload and returns the key/URL."""
    # In a real scenario, use boto3 to upload to MinIO/S3
    # For now, we'll just return a mock path
    return f"generations/{filename}"

def notify_api(generation_id, status, assets=None, error=None):
    """Notify the NestJS API about the task progress."""
    url = f"{API_BASE_URL}/generations/{generation_id}/status"
    payload = {
        "status": status,
        "assets": assets,
        "errorMessage": error
    }
    try:
        response = requests.patch(url, json=payload)
        response.raise_for_status()
        print(f"Notified API for {generation_id}: {status}")
    except Exception as e:
        print(f"Failed to notify API: {e}")

def process_tasks():
    print(f"AI Worker started. Listening on blaze_image_tasks...")
    while True:
        # BLPOP blocks until an item is available
        task_data = r.blpop("blaze_image_tasks", timeout=0)
        if task_data:
            _, message = task_data
            task = json.loads(message)
            generation_id = task['id']
            prompt = task['prompt']
            
            print(f"Processing task {generation_id}: {prompt}")
            
            # 1. Update status to PROCESSING
            notify_api(generation_id, "PROCESSING")
            
            try:
                # 2. Simulate AI Generation time
                time.sleep(2) 
                image_bytes = generate_mock_image(prompt)
                
                # 3. Save / Upload
                filename = f"{generation_id}.png"
                s3_key = upload_to_s3(image_bytes, filename)
                
                # 4. Notify Completion
                assets = [{
                    "s3Key": s3_key,
                    "width": 512,
                    "height": 512,
                    "versionType": "ORIGINAL"
                }]
                notify_api(generation_id, "COMPLETED", assets=assets)
                
            except Exception as e:
                print(f"Error processing task: {e}")
                notify_api(generation_id, "FAILED", error=str(e))

if __name__ == "__main__":
    process_tasks()
