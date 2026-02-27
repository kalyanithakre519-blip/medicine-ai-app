import requests

def test_add():
    url = "http://127.0.0.1:8000/api/patients"
    # Note: This will likely fail with 401, but we want to see if the route exists
    try:
        r = requests.post(url, json={"name": "Test"}, timeout=2)
        print(f"Status Code: {r.status_code}")
        print(f"Response: {r.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_add()
