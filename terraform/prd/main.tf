module "backend" {
  source      = "../base"
  aks_cluster = "aks-0-prd30-rolldupapp-com"
  domain      = "prd30.rolldupapp.com"
}

output "client_id" {
  value = module.backend.backend_client_id
}
