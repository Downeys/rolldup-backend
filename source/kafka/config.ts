import { CompressionTypes, CompressionCodecs, Kafka } from 'kafkajs';
import LZ4Codec from 'kafkajs-lz4';

CompressionCodecs[CompressionTypes.LZ4] = new LZ4Codec().codec;
const bootstrap = process.env['BOOTSTRAP_SERVER'] || 'broker:9092';
const kafka = new Kafka({
    clientId: 'backend',
    brokers: [bootstrap],
});

export default kafka;
