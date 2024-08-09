locals {
  application_name = replace("backend-${var.domain}", ".", "-")
}

resource "azuread_application" "backend" {
  display_name = local.application_name
}

resource "azuread_service_principal" "backend" {
  application_id = azuread_application.backend.application_id
}

resource "azuread_service_principal_password" "backend" {
  service_principal_id = azuread_service_principal.backend.id
}

data "azurerm_kubernetes_cluster" "cluster" {
  name                = var.aks_cluster
  resource_group_name = var.domain
}

resource "azuread_application_federated_identity_credential" "backend" {
  application_object_id = azuread_application.backend.object_id
  display_name          = local.application_name
  audiences             = ["api://AzureADTokenExchange"]
  issuer                = data.azurerm_kubernetes_cluster.cluster.oidc_issuer_url
  subject               = "system:serviceaccount:application:${local.application_name}"
}

output "backend_client_id" {
  value = azuread_application.backend.application_id
}
