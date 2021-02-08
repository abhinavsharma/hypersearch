## Lumos extension architecture

## User facing components

### Sidebar

Collapsed state
<img src="https://p42.f3.n0.cdn.getcloudapp.com/items/6quQ5Xwo/1e52c92c-9ff9-4be2-b701-781cd7bd8517.png?source=viewer&v=5e62ab3dd376552d97c6bd917f4bd7e9" />

Expanded state

<img src="https://p42.f3.n0.cdn.getcloudapp.com/items/rRuk9Bdr/649fd91f-8c36-4762-ab8e-d375b8a547cd.png?v=683c85eecee33cdca72031f4fc4f39a6" />

What determines what tabs are the sidebar?
1. The extension calls the subtabs API with the url of the currently loaded page.
2. The subtabs API returns `suggested_augmentations` and `subtabs`. We ignore subtabs.
3. suggested_augmentations is the list of JSON blobs, each representing an extension
4. We only care about the extensions that are custom search engines, we parse them in `handleSubtabApiResponse`

**What is the return of the subtabs API?**
<img src="https://p42.f3.n0.cdn.getcloudapp.com/items/WnuBG8B5/293ae3cf-1c87-439f-9583-8a4e176674be.png?source=viewer&v=05aeb84df34de3f883146be3134e6635" />

There are 2 main keys to care about

1. `suggested_augmentations`: this is a list of mobile extensions. We care about a subset of them, specifically ones with `id` beginning with `cse` representing custom search engines.
2. `subtabs`: these are URLs that we want the sidebar to render. This is currently NOT TO BE USED. We may bring it back soon though

**When is the sidebar default expanded vs default collapsed?**
Right now so long as there is at least 1 valid subtab we expand the extension.

## Legacy Parts that need to be removed

### Login
In a past version we required login to use the extension. We might bring this back but for now the extension is focused on search only

## Rendering `subtabs`
The subtabs API also returns a key `subtabs` used to just return URLs to render in the sidebar. We don't want to use these any more
