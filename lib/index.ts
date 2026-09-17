// Index for library exports

export { getHostColor } from "./getHostColor";
export { getGitHubPersonalAccessToken } from "./settings";

// Support
export { getRandomHtmlColorName } from "./getRandomHtmlColorName";
export { showHostPlatform } from "./showHostPlatform";
export { showConsole } from "./showConsole";
export { SimpleUi } from "./SimpleUi";
export type { SimpleUiElementIds, SimpleUiImg } from "./SimpleUi";

// GitHub
export { getGitHubModelInference } from "./github/getGitHubModelInference";
export { getGitHubModelCatalog } from "./github/getGitHubModelCatalog";
export type { GitHubModelCatalogueEntry } from "./github/GitHubModelCatalogueEntry";
export type { GitHubModelInferenceParameters } from "./github/GitHubModelInferenceParameters";

export { getOfficeDocumentName } from "./getOfficeDocumentName";
export type { ExternalLambdaInstance } from "./GlobalExternalLambda";
export { initializeExternalLambda } from "./GlobalExternalLambda";
