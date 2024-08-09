terraform {
  backend "azurerm" {
    resource_group_name  = "terraform"
    storage_account_name = "terraform6j6i1zi8nef15h3"
    container_name       = "tfstate"
    key                  = "prd30-app-backend"
  }
}
