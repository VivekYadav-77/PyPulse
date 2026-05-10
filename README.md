# PyPulse

PyPulse is a full-stack Python code playground. It provides a browser-based editor, sends code to a Django REST API, executes it in a controlled backend subprocess with a strict 2-second timeout, and displays stdout, stderr, timeout, and runtime status in a polished split-pane interface.

## Features

- Monaco editor with Python syntax highlighting
- Dark, responsive editor/output layout
- Run button and `Ctrl + Enter` shortcut
- stdout and stderr output panels
- Runtime error and timeout states
- 2-second execution timeout
- 50,000-character input validation
- 10,000-character output truncation
- Copy-to-clipboard for stdout
- Optional Docker sandbox execution mode

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, TypeScript, Tailwind CSS |
| Editor | Monaco Editor |
| Backend | Django, Django REST Framework |
| Execution | Python subprocess with timeout |
| Optional Isolation | Docker |

## Project Structure

```text
pyrunner/
|-- backend/
|   |-- core/
|   |-- executor/
|   |-- manage.py
|   `-- requirements.txt
|-- docker/
|   |-- Dockerfile.runner
|   `-- run_in_docker.py
|-- frontend/
|   |-- app/
|   |-- components/
|   |-- hooks/
|   |-- lib/
|   `-- package.json
`-- README.md
```

## Prerequisites

Install these before running the project:

- Python 3.12+
- Node.js 20+
- npm
- Optional: Docker Desktop, only if you want Docker sandbox mode

## Run Locally

Open two terminals from the project root:

```powershell
cd "D:\pyrunner"
```

### 1. Backend

In the first terminal:

```powershell
cd backend
..\venv\Scripts\python.exe -m pip install -r requirements.txt
..\venv\Scripts\python.exe manage.py runserver 8000
```

If you do not already have the virtual environment, create it first:

```powershell
cd "D:\pyrunner"
python -m venv venv
.\venv\Scripts\python.exe -m pip install -r backend\requirements.txt
cd backend
..\venv\Scripts\python.exe manage.py runserver 8000
```

The backend will run at:

```text
http://localhost:8000
```

### 2. Frontend

In the second terminal:

```powershell
cd "D:\frontend"
npm.cmd install
npm.cmd run dev
```

The frontend will run at:

```text
http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## macOS/Linux Commands

If you are not on Windows, use these equivalent commands:

```bash
cd pyrunner
python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
cd backend
python manage.py runserver 8000
```

In another terminal:

```bash
cd pyrunner/frontend
npm install
npm run dev
```

## API Endpoint

### `POST /api/run/`

Request body:

```json
{
  "code": "print(\"Hello Empower\")"
}
```

Successful response:

```json
{
  "stdout": "Hello Empower\n",
  "stderr": "",
  "timed_out": false,
  "exit_code": 0
}
```

Timeout response:

```json
{
  "stdout": "",
  "stderr": "Execution timed out after 2 seconds.",
  "timed_out": true,
  "exit_code": null
}
```

## Verification Cases

Try these in the editor:

```python
print("Hello Empower")
```

```python
while True:
    pass
```

```python
x = 1 / 0
```

```python
for i in range(5):
    print(f"Line {i + 1}")
```

Expected behavior:

- normal output appears in stdout
- infinite loops stop after about 2 seconds
- runtime errors appear in stderr
- empty code does not send a request
- very long output is truncated with a notice

## Optional Docker Sandbox

Docker mode is optional. The app works without Docker using the direct subprocess runner.

To enable Docker mode, install and start Docker Desktop, then build the sandbox image:

```powershell
cd "D:\pyrunner"
docker build -t pypulse-sandbox -f docker\Dockerfile.runner .
```

Start the backend with Docker mode:

```powershell
cd backend
$env:PYRUNNER_USE_DOCKER="true"
..\venv\Scripts\python.exe manage.py runserver 8000
```

Docker mode runs code in a disposable container with no network access, memory limits, CPU limits, and a read-only filesystem.

## Environment Notes

Frontend development uses the Next.js proxy. Keep this in `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=
```

Backend development defaults are stored in `backend/.env`:

```env
PYRUNNER_USE_DOCKER=false
DEBUG=true
SECRET_KEY=your-dev-secret-key-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1
```

## Common Issues

### `ModuleNotFoundError: No module named 'django'`

Install backend dependencies into the project virtual environment:

```powershell
cd "D:\folder"
..\venv\Scripts\python.exe -m pip install -r requirements.txt
```

### `pip install requirements.txt` fails

Use `-r`:

```powershell
pip install -r requirements.txt
```

### Frontend command blocked in PowerShell

Use `npm.cmd`:

```powershell
npm.cmd run dev
```

## Production Notes

For production, use a real secret key, set `DEBUG=False`, configure `ALLOWED_HOSTS`, run Django with a production server such as Gunicorn or Waitress, and use a reverse proxy instead of the development Next.js rewrite.


## Security Risks Still Present

Although the application includes execution timeout handling and optional Docker isolation, some security risks still exist:

- User-submitted Python code is still arbitrary code execution and may attempt malicious operations.
- High memory or CPU usage attacks may still affect server performance.
- File system or environment access could become a risk if sandboxing is misconfigured.
- Multiple simultaneous execution requests could lead to denial-of-service (DoS) issues.
- The current implementation is designed as a prototype and is not fully hardened for untrusted public usage.

## Production Scalability Plan

If 500 students pressed "Run" at the same time, the current single-server architecture could become overloaded.

For production-scale reliability, the system could be redesigned using:

- Docker-based isolated execution containers for each code run
- A distributed task queue such as Celery, Redis Queue, or RabbitMQ
- Multiple worker servers dedicated only to code execution
- Rate limiting and request throttling
- Horizontal scaling with load balancers
- Kubernetes or container orchestration for automatic scaling
- Separation of frontend, API, and execution workers into independent services

This would prevent the main API server from crashing under heavy concurrent usage.
