/**
 * Non streaming response from GitHub model inference API.
 *
 * @beta
 */
export interface GitHubModelInferenceResponse {
    model: string;
    choices: {
        /**
         * The message associated with the completion.
         */
        message: {
            /**
             * The role of the message.
             */
            role: string;
            /**
             * The content of the message.
             */
            content: string;
        };
    }[];
}
