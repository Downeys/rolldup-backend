import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

import log from '../config/logging';

interface KeyVaultSecrets {
    PG_PASSWORD: string | undefined;
    BLOB_CONNECTION_STRING: string | undefined;
    COMPUTER_VISION_ACCESS_KEY: string | undefined;
}

async function fetchKeyVaultConfigOverrides(): Promise<KeyVaultSecrets> {
    if (!process.env.AZURE_CLIENT_ID || !process.env.KEY_VAULT_NAME) {
        log.info('azure', 'azure environment variables not present, not supplying keyvault overrides', { clientId: process.env.AZURE_CLIENT_ID, keyVaultName: process.env.KEY_VAULT_NAME });
        return {
            PG_PASSWORD: undefined,
            BLOB_CONNECTION_STRING: undefined,
            COMPUTER_VISION_ACCESS_KEY: undefined,
        };
    }

    const credential = new DefaultAzureCredential();
    const url = `https://${process.env.KEY_VAULT_NAME}.vault.azure.net`;

    const client = new SecretClient(url, credential);

    const overrides: any = {};

    for await (let secret of client.listPropertiesOfSecrets()) {
        const value = await client.getSecret(secret.name);
        overrides[secret.name.replaceAll('-', '_')] = value.value;
    }

    log.info('azure', 'loaded sensitive keys', { keys: Object.keys(overrides) });

    return overrides;
}

export { fetchKeyVaultConfigOverrides };
