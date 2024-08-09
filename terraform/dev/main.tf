module "backend" {
  source      = "../base"
  aks_cluster = "aks-0-dev50-rolldupapp-com"
  domain      = "dev50.rolldupapp.com"
}

output "client_id" {
  value = module.backend.backend_client_id
}
