import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { KafkaJsInstrumentation } from 'opentelemetry-instrumentation-kafkajs';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const healthcheckRegex = /.*healthcheck.*/;

const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces'
    }),
    instrumentations: [getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-http': {
            ignoreIncomingRequestHook: (request) => healthcheckRegex.test(request.url || '')
        },
    }), new KafkaJsInstrumentation()]
});

sdk.start();
