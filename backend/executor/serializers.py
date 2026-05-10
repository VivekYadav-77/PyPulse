from rest_framework import serializers


class RunRequestSerializer(serializers.Serializer):
    code = serializers.CharField(
        required=True,
        allow_blank=False,
        max_length=50_000,
        error_messages={
            "required": "Field 'code' is required.",
            "blank": "Code cannot be empty.",
            "max_length": "Code exceeds the 50,000 character limit.",
        },
    )
