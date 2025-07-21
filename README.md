# Gateway Data

⚙ Static files and config for the Driving Boba Network gateway!

## Local Development

You can run the light server locally to validate that the changes have been added correctly with content URL, type, and icon.

```shell
# Default will start at localhost:8000
python3 -m http.server
```

Once your changes are merged, they can be visible for review purposes.

## Demos
[Ecosystem Project Review Demo](https://bobanetwork.github.io/gateway-data/ecosystem/index.html)
[Trade Project Review Demo](https://bobanetwork.github.io/gateway-data/ecosystem/dex.html)


# Project Update Process
To add or remove projects from the JSON data, please follow these steps:

## Create an Issue:

### Use the appropriate issue template to request the addition or removal of a project:
  - [Add Project Template](.github/ISSUE_TEMPLATE/add-ecosystem-project.md)
  - [Remove Project Template](.github/ISSUE_TEMPLATE/remove-ecosystem-project.md)
  
### Review Process:
  - Assigned team members will review your request and provide feedback.
  - Once approved, the changes will be made to the JSON data.
  
### Create a Pull Request:
  - After your issue is approved, create a pull request using the Project Update Pull Request Template.
  - Ensure to provide all necessary details, including project information and reason for removal (if applicable).


## To remove icon files in nested folders. 

```ssh
find . -type f \( -name '*Dega*.svg' -o -name '*Dega*.webp' \) -delete
```
