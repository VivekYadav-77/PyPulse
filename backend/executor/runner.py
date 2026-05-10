import json
import os
import subprocess
import sys
import tempfile

USE_DOCKER = os.environ.get("PYRUNNER_USE_DOCKER", "false").lower() == "true"
MAX_OUTPUT = 10_000

DOCKER_SCRIPT = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "docker",
    "run_in_docker.py",
)


def _truncate(text: str, limit: int = MAX_OUTPUT) -> str:
    if len(text) <= limit:
        return text
    return text[:limit] + f"\n\n[Output truncated at {limit} characters]"


def run_python_code(code: str) -> dict:
    """
    Write code to a temp file, execute it in a subprocess,
    enforce a 2-second timeout, and return structured output.

    Returns:
        {
            "stdout": str,
            "stderr": str,
            "timed_out": bool,
            "exit_code": int | None
        }
    """
    tmp_path = None

    try:
        with tempfile.NamedTemporaryFile(
            suffix=".py",
            mode="w",
            encoding="utf-8",
            delete=False,
        ) as tmp_file:
            tmp_file.write(code)
            tmp_path = tmp_file.name

        if USE_DOCKER:
            return _run_in_docker(tmp_path)

        return _run_direct(tmp_path)

    except Exception as exc:
        return {
            "stdout": "",
            "stderr": f"Internal execution error: {str(exc)}",
            "timed_out": False,
            "exit_code": -1,
        }

    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except OSError:
                pass


def _run_direct(tmp_path: str) -> dict:
    """Execute code directly using subprocess."""
    try:
        result = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True,
            text=True,
            timeout=2,
        )
        return {
            "stdout": _truncate(result.stdout),
            "stderr": _truncate(result.stderr),
            "timed_out": False,
            "exit_code": result.returncode,
        }
    except subprocess.TimeoutExpired:
        return {
            "stdout": "",
            "stderr": "Execution timed out after 2 seconds.",
            "timed_out": True,
            "exit_code": None,
        }


def _run_in_docker(tmp_path: str) -> dict:
    """Execute code inside a Docker container via the Docker runner script."""
    try:
        result = subprocess.run(
            [sys.executable, DOCKER_SCRIPT, tmp_path],
            capture_output=True,
            text=True,
            timeout=5,
        )
        docker_result = json.loads(result.stdout)
        return {
            "stdout": _truncate(docker_result.get("stdout", "")),
            "stderr": _truncate(docker_result.get("stderr", "")),
            "timed_out": docker_result.get("timed_out", False),
            "exit_code": docker_result.get("exit_code"),
        }

    except subprocess.TimeoutExpired:
        return {
            "stdout": "",
            "stderr": "Execution timed out (Docker mode).",
            "timed_out": True,
            "exit_code": None,
        }
    except json.JSONDecodeError:
        return {
            "stdout": "",
            "stderr": "Docker runner returned invalid response.",
            "timed_out": False,
            "exit_code": -1,
        }
