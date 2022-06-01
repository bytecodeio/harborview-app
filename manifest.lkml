project_name: "kitchensink"

application: kitchensink {
  label: "Kitchen sink"
  url: "http://localhost:8080/bundle.js"
  entitlements: {
    local_storage: yes
    navigation: yes
    new_window: yes
    allow_same_origin: yes
    allow_forms: yes
    core_api_methods: ["all_connections", "all_roles"]
  }
}
