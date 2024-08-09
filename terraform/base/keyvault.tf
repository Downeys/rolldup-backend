locals {
  vault_name = "backend-${split(".", var.domain)[0]}"
}

data "azurerm_client_config" "current" {}

data "azurerm_key_vault" "backend_vault" {
  name                = local.vault_name
  resource_group_name = var.domain
}

resource "azurerm_key_vault_access_policy" "aks" {
  key_vault_id = data.azurerm_key_vault.backend_vault.id

  tenant_id = data.azurerm_client_config.current.tenant_id
  object_id = azuread_service_principal.backend.object_id

  secret_permissions = [
    "Get",
    "List",
  ]
}
