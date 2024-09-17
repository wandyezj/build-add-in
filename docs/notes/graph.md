# Graph

- Store things on OneDrive
    - [Nested App Auth](https://learn.microsoft.com/en-us/office/dev/add-ins/develop/enable-nested-app-authentication-in-your-add-in)



[](https://learn.microsoft.com/en-us/entra/identity-platform/scenario-spa-app-registration)
Selected the 


- [App Registration](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade)

[App Folder](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/concepts/special-folders-appfolder?view=odsp-graph-online)



Want to be a [verified publisher](https://learn.microsoft.com/en-us/entra/identity-platform/publisher-verification-overview)


## Sample

[NAA Sample](https://github.com/OfficeDev/Office-Add-in-samples/blob/main/Samples/auth/Office-Add-in-SSO-NAA/README.md)

- Seems to require having a registered business.

## Graph API

- [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)






### App Folder

- [App folder](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/concepts/special-folders-appfolder?view=odsp-graph-online)

#### Create App Folder

POST drive/special/approot/children

> https://graph.microsoft.com/v1.0/me/drive/special/approot/children

Request Body

```json
{
    "folder": { "@odata.type": "microsoft.graph.folder" },
    "name":"graph-explorer"
}
```

#### List App Folder Children

GET /drive/special/approot/children

> https://graph.microsoft.com/v1.0/me/drive/special/approot/children

#### Upload Content

PUT /drive/special/approot:/{fileName}:/content

> https://graph.microsoft.com/v1.0/me/drive/special/approot:/test.txt:/content

Request Body

```text
Text to upload
```

Headers

Content-Type : text/plain

Note

works for json as well since this is just a text file.

#### Get Content

GET /drive/special/approot:/{path}:/content

> https://graph.microsoft.com/v1.0/me/drive/special/approot:/test.txt:/content


GET /me/drive/items/{item-id}/content


Note

seems to be blocked in graph explorer due to CORS?