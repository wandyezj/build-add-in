import { getGitHubUser } from "./github/getGitHubUser";
import { getGitHubUserGpgKeysRaw } from "./github/getGitHubUserGpgKeysRaw";
import { log, LogTag } from "./log";
import { pgpSignatureMatches } from "./pgp/pgpSignatureMatches";
import { Snip, getSnipDocText } from "./Snip";

export enum SnipAuthorResultCode {
    Verified = "Verified",
    NoSignature = "NoSignature",
    GitHubUserNotFound = "GitHubUserNotFound",
    GitHubGpgKeysMissing = "GitHubGpgKeysMissing",
    InvalidSignature = "InvalidSignature",
}

export type SnipAuthorResult =
    | {
          result: SnipAuthorResultCode.Verified;
          author: {
              username: string;
              avatar: string;
              userIds: string[];
          };
      }
    | {
          result: Exclude<SnipAuthorResultCode, SnipAuthorResultCode.Verified>;
      };

/**
 * @returns author details when the snip signature validates, otherwise a descriptive error.
 */
export async function getSnipAuthor(snip: Snip): Promise<SnipAuthorResult> {
    const { author } = snip;
    if (author === undefined) {
        return { result: SnipAuthorResultCode.NoSignature };
    }

    const { username, signature } = author;

    if (username === undefined || signature === undefined) {
        return { result: SnipAuthorResultCode.InvalidSignature };
    }

    const user = await getGitHubUser(username);
    if (user === undefined) {
        return { result: SnipAuthorResultCode.GitHubUserNotFound };
    }
    const avatar = user.avatar_url;

    const messageText = getSnipDocText(snip);

    // public keys linked to the GitHub user
    const publicKeys = await getGitHubUserGpgKeysRaw(username);
    if (publicKeys === undefined) {
        log(LogTag.UploadFile, `GitHub GPG key for user ${username} not found`);
        return { result: SnipAuthorResultCode.GitHubGpgKeysMissing };
    }

    const result = await pgpSignatureMatches({
        messageText,
        publicKeysArmored: publicKeys,
        detachedSignature: signature,
    });

    if (!result.matches) {
        return { result: SnipAuthorResultCode.InvalidSignature };
    }
    const { userIds } = result;

    return {
        result: SnipAuthorResultCode.Verified,
        author: {
            username,
            avatar,
            userIds,
        },
    };
}
