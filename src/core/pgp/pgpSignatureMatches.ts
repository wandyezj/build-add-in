import { readKeys, createMessage, readSignature, verify } from "openpgp";

export async function pgpSignatureMatches({
    messageText,
    publicKeyArmored,
    detachedSignature,
}: {
    messageText: string;
    publicKeyArmored: string;
    detachedSignature: string;
}): Promise<{ matches: false } | { matches: true; userIds: string[] }> {
    const publicKeys = await readKeys({ armoredKeys: publicKeyArmored });

    // publicKeys.forEach((key) => {
    //     console.log("Public Key ID: " + key.getKeyID().toHex());
    //     console.log("Public Key User IDs: " + key.getUserIDs().join(", "));
    //     console.log("Public Key Fingerprint: " + key.getFingerprint());
    // });

    const message = await createMessage({ text: messageText });

    const signature = await readSignature({
        armoredSignature: detachedSignature,
    });

    const verificationResult = await verify({
        message,
        signature,
        verificationKeys: publicKeys,
    });

    const { verified: verifiedPromise, keyID: keyId } = verificationResult.signatures[0];

    try {
        // True if the signature matches
        // throws on invalid signature
        const matches = await verifiedPromise;
        console.log("Signed by key id " + keyId.toHex());

        const userIds = publicKeys
            .filter((key) => key.getKeys(keyId))
            .flat()
            .map((key) => key.getUserIDs())
            .flat()
            .filter((value, index, self) => {
                // Filter out duplicate user IDs
                return self.indexOf(value) === index;
            });

        return { matches, userIds };
    } catch (e: unknown) {
        console.error("Signature verification failed:", (e as { message: string }).message);
    }

    return { matches: false };
}
