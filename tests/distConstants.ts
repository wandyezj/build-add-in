import path from "path";
import { getRootDirectory } from "./getRootDirectory";

export const localDistPath = path.resolve(getRootDirectory(), "dist");

export const localDistManifestsPath = path.resolve(localDistPath, "manifests");
export const localDistManifestProductionPath = path.resolve(localDistManifestsPath, "production.xml");
export const localDistManifestProductionOutlookPath = path.resolve(localDistManifestsPath, "production.outlook.xml");
