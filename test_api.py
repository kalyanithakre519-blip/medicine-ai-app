import requests
import json

base_url = "http://127.0.0.1:8000"

def test_auth():
    # Attempt to login with existing user
    # Note: We don't know the password, but we can check if the route exists
    print("Checking API root...")
    try:
        r = requests.get(f"{base_url}/")
        print(f"Status: {r.status_code}, Response: {r.json()}")
    except Exception as e:
        print(f"Error: {e}")
        return

    print("\nChecking medicines (should be 401)...")
    try:
        r = requests.get(f"{base_url}/api/medicines")
        print(f"Status: {r.status_code}, Response: {r.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_auth()
