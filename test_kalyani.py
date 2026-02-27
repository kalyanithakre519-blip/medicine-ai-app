import requests
import json

base_url = "http://127.0.0.1:8000"

def test_kalyani_flow():
    email = "kalyanithakre519@gmail.com"
    password = "kalyani@123"
    
    print(f"Logging in as {email}...")
    try:
        r = requests.post(f"{base_url}/api/auth/login", json={"email": email, "password": password})
        print(f"Login Status: {r.status_code}")
        if r.status_code != 200:
            print(f"Error: {r.text}")
            return
        
        data = r.json()
        token = data.get("token")
        print(f"Token received: {token[:20]}...")
        
        print("\nFetching profile with token...")
        headers = {"Authorization": f"Bearer {token}"}
        r2 = requests.get(f"{base_url}/api/auth/profile", headers=headers)
        print(f"Profile Status: {r2.status_code}")
        print(f"Profile Response: {r2.text}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_kalyani_flow()
