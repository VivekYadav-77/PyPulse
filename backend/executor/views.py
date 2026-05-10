import logging

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .runner import run_python_code
from .serializers import RunRequestSerializer

logger = logging.getLogger(__name__)


@api_view(["POST"])
def run_view(request):
    """
    POST /api/run/
    Body:  { "code": "<python source code>" }
    Returns:
    {
        "stdout":    string,
        "stderr":    string,
        "timed_out": boolean,
        "exit_code": integer | null
    }
    """
    serializer = RunRequestSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {"error": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    code = serializer.validated_data["code"]
    result = run_python_code(code)

    logger.info(
        "Code executed | timed_out=%s | exit_code=%s | stdout_len=%d",
        result["timed_out"],
        result["exit_code"],
        len(result["stdout"]),
    )

    return Response(result, status=status.HTTP_200_OK)
