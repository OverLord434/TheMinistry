from rest_framework import serializers

class ManualParseSerializer(serializers.Serializer):
    url = serializers.URLField()
    send_to_email = serializers.BooleanField(default=False)
    email_subject = serializers.CharField(required=False, allow_blank=True)
    email_body = serializers.CharField(required=False, allow_blank=True)


class AutoCheckSerializer(serializers.Serializer):
    email_subject = serializers.CharField(required=False, allow_blank=True)
    email_body = serializers.CharField(required=False, allow_blank=True)
