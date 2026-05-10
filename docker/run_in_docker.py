"""
Standalone script that runs a Python file inside a Docker container.
Called by the Django runner as a subprocess.

Usage:
    python run_in_docker.py <path_to_code_file>

Output (JSON on stdout):
    { "stdout": "...", "stderr": "...", "timed_out": false }
"""
import json
import subprocess
import sys
import uuid

MAX_OUTPUT = 10_000


def _truncate(text: str, limit: int = MAX_OUTPUT) -> str:
    if len(text) <= limit:
        return text
    return text[:limit] + f"\n\n[Output truncated at {limit} characters]"


def run_in_docker(code_file_path: str) -> dict:
    """
    Runs the given Python file inside a throwaway Docker container.
    The container:
    - Uses python:3.12-slim (non-root user)
    - Has NO network access (--network none)
    - Is auto-removed on exit (--rm)
    - Has a 2-second CPU/wall timeout
    - Mounts the code file read-only
    """
    container_name = f"pypulse-{uuid.uuid4().hex}"

    try:
        result = subprocess.run(
            [
                "docker",
                "run",
                "--rm",
                "--name",
                container_name,
                "--network",
                "none",
                "--memory",
                "64m",
                "--cpus",
                "0.5",
                "--read-only",
                "--tmpfs",
                "/tmp:size=10m",
                "--volume",
                f"{code_file_path}:/code/main.py:ro",
                "pypulse-sandbox",
                "python3",
                "/code/main.py",
            ],
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
        try:
            subprocess.run(
                ["docker", "rm", "-f", container_name],
                capture_output=True,
                text=True,
                timeout=2,
            )
        except Exception:
            pass
        return {
            "stdout": "",
            "stderr": "Execution timed out after 2 seconds.",
            "timed_out": True,
            "exit_code": None,
        }

    except Exception as exc:
        return {
            "stdout": "",
            "stderr": f"Docker execution error: {str(exc)}",
            "timed_out": False,
            "exit_code": -1,
        }


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: run_in_docker.py <file>"}))
        sys.exit(1)

    result = run_in_docker(sys.argv[1])
    print(json.dumps(result))
