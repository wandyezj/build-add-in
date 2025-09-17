import { getGitHubUser } from "./github/getGitHubUser";
import { getGitHubUserGpgKeys } from "./github/getGitHubUserGpgKeys";
import { log, LogTag } from "./log";
import { pgpSignatureMatches } from "./pgp/pgpSignatureMatches";
import { SnipWithSource, getSnipDocText } from "./Snip";

/**
 * @returns author info if the snip is signed and the signature matches the public key of the author.
 * If the snip is not signed or the signature does not match, returns undefined.
 */
export async function getSnipAuthor(
    snip: SnipWithSource
): Promise<undefined | { username: string; avatar: string; userIds: string[] }> {
    const { author } = snip;
    if (author === undefined) {
        return undefined;
    }

    const { username, signature } = author;

    const user = await getGitHubUser(username);
    if (user === undefined) {
        return undefined;
    }
    const avatar = user.avatar_url;

    const messageText = getSnipDocText(snip);

    // public keys linked to the GitHub user
    const publicKey = await getGitHubUserGpgKeys(username);
    if (publicKey === undefined) {
        log(LogTag.UploadFile, `GitHub GPG key for user ${username} not found`);
        return undefined;
    }

    const result = await pgpSignatureMatches({
        messageText,
        publicKeyArmored: publicKey,
        detachedSignature: signature,
    });

    if (!result.matches) {
        return undefined;
    }
    const { userIds } = result;

    return {
        username,
        avatar,
        userIds,
    };
}
