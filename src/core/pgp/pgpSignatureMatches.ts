import { readKeys, createMessage, readSignature, verify } from "openpgp";

export async function pgpSignatureMatches({
    messageText,
    publicKeyArmored,
    detachedSignature,
}: {
    messageText: string;
    publicKeyArmored: string;
    detachedSignature: string;
}): Promise<boolean> {
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

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { verified: verifiedPromise, keyID } = verificationResult.signatures[0];

    let matches = false;
    try {
        // True if the signature matches
        // throws on invalid signature
        matches = await verifiedPromise;
        console.log("Signed by key id " + keyID.toHex());
    } catch (e: unknown) {
        console.error("Signature verification failed:", (e as { message: string }).message);
    }

    return matches;
}
