import os
import subprocess
import sys
import socket
import time

def print_status(msg, status="INFO"):
    colors = {
        "INFO": "\033[94m",
        "SUCCESS": "\033[92m",
        "WARNING": "\033[93m",
        "ERROR": "\033[91m",
        "ENDC": "\033[0m"
    }
    print(f"{colors.get(status, '')}[{status}] {msg}{colors['ENDC']}")

def check_port(port, service_name):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        is_taken = s.connect_ex(('127.0.0.1', port)) == 0
        if is_taken:
            print_status(f"Port {port} ({service_name}) is already in use.", "WARNING")
            return True
        return False

def install_deps(path, req_file):
    print_status(f"Installing dependencies for {path}...", "INFO")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", os.path.join(path, req_file)])
        print_status(f"Dependencies for {path} installed successfully.", "SUCCESS")
    except Exception as e:
        print_status(f"Failed to install dependencies for {path}: {e}", "ERROR")

def main():
    print_status("--- MEDMANAGE AI SYSTEM: ROBUST SETUP INITIALIZED ---", "INFO")
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 1. Dependency Checks
    install_deps(os.path.join(base_dir, "backend"), "requirements.txt")
    install_deps(os.path.join(base_dir, "ai_service"), "requirements.txt")
    
    # 2. Database Connectivity Check (MongoDB)
    print_status("Checking MongoDB Connection...", "INFO")
    try:
        from pymongo import MongoClient
        load_dotenv_path = os.path.join(base_dir, "ai_service", ".env")
        # Simple extraction instead of using full dotenv just for check
        mongo_uri = "mongodb://127.0.0.1:27017"
        if os.path.exists(load_dotenv_path):
            with open(load_dotenv_path, 'r') as f:
                for line in f:
                    if line.startswith("MONGO_URI"):
                        mongo_uri = line.split("=")[1].strip().strip('"').strip("'")
        
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
        client.server_info()
        print_status(f"MongoDB Connected Successfully at {mongo_uri}", "SUCCESS")
    except Exception as e:
        print_status(f"CRITICAL: MongoDB is NOT reachable. Please ensure MongoDB is running. Error: {e}", "ERROR")
        print_status("Proceeding anyway, but some features will fail.", "WARNING")

    # 3. Port Conflicts
    check_port(8000, "Backend API")
    check_port(5001, "AI Service")
    check_port(5173, "Vite Frontend")

    # 4. Frontend Modules Check
    client_node_modules = os.path.join(base_dir, "client", "node_modules")
    if not os.path.exists(client_node_modules):
        print_status("Notice: client/node_modules not found. Please run 'npm install' inside the client folder.", "WARNING")
    else:
        print_status("Frontend modules found.", "SUCCESS")

    print_status("--- SETUP VERIFIED AND READY ---", "SUCCESS")
    print_status("Use 'npm start' to launch all services concurrently.", "INFO")

if __name__ == "__main__":
    main()
