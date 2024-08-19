# harbourview-app
 
This is a branded Looker Extension Framework application. It serves dashboards within tabs and has a dashboard selection menu, based on folders configured by admins.


## Getting Started for Development

1. Install the dependencies with [Yarn](https://yarnpkg.com/).

   ```sh
   yarn install
   ```

2. Build the project

   ```sh
   yarn build
   ```

3. Start the development server

   ```sh
   yarn develop
   ```

4. In Looker add the following to a manifest file inside a lookMl project:

    ```sh
    application: hits {
    label: "HITS"
    file: "applications/hits.js"
    entitlements: {
        use_embeds: yes
        core_api_methods: ["all_connections","all_projects","all_groups"
        , "all_users", "all_folders"
        , "search_folders", "run_inline_query", "me"
        , "lookml_model_explore", "all_lookml_models", "search_dashboard_elements", "run_query", "dashboard","all_user_attributes","create_sso_embed_url"
        ,"folder_dashboards","user","all_roles"]
        oauth2_urls: ["https://*.looker.com"]
        external_api_urls: ["https://*.looker.com"]
        navigation: yes
        new_window: yes
        use_iframes: yes
        use_form_submit: yes
    }
    }
    ```

    After committing this change to production, the extension should be available at the bottom of the main Looker menu. 

## Demoing

When demoing, replace the /extension portion of the url with /spartan to get a full-page experience without the Looker controls. 