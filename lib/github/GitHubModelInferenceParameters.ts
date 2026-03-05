/**
 * https://docs.github.com/en/rest/models/inference
 * @beta
 */
export interface GitHubModelInferenceParameters {
    /**
     * ID of the specific model to use for the request. The model ID should be in the format of \{publisher\}/\{model_name\} where "openai/gpt-4.1" is an example of a model ID.
     * You can find supported models in the catalog/models endpoint.
     */
    model: string;

    /**
     * The collection of context messages associated with this chat completion request.
     * Typical usage begins with a chat message for the System role that provides instructions for the behavior of the assistant, followed by alternating messages between the User and Assistant roles.
     */
    messages: {
        /**
         * The chat role associated with this message
         * Can be one of: assistant, developer, system, user
         */
        role: string | "assistant" | "developer" | "system" | "user";

        /**
         * The content of the message.
         */
        content: string;
    }[];

    /**
     * A value that influences the probability of generated tokens appearing based on their cumulative frequency in generated text.
     * Positive values will make tokens less likely to appear as their frequency increases and decrease the likelihood of the model repeating the same statements verbatim.
     * Supported range is [-2, 2].
     */
    frequency_penalty?: number;

    /**
     * The maximum number of tokens to generate in the completion. The token count of your prompt plus max_tokens cannot exceed the model's context length.
     * For example, if your prompt is 100 tokens and you set max_tokens to 50, the API will return a completion with a maximum of 50 tokens.
     */
    max_tokens?: number;

    /**
     * The modalities that the model is allowed to use for the chat completions response.
     * The default modality is text.
     * Indicating an unsupported modality combination results in a 422 error. Supported values are: text, audio
     */
    modalities?: (string | "text" | "audio")[];

    /**
     * A value that influences the probability of generated tokens appearing based on their existing presence in generated text.
     * Positive values will make tokens less likely to appear when they already exist and increase the model's likelihood to output new tokens.
     * Supported range is [-2, 2].
     */
    presence_penalty?: number;

    /**
     * The desired format for the response.
     * Can be one of these objects:
     */
    response_format?:
        | {
              /**
               * Can be one of: text, json_object
               */
              type?: "text" | "json_object";
          }
        | {
              /**
               * The type of the response.
               * Value: json_schema
               */
              type: "json_schema";
              /**
               * The JSON schema for the response.
               */
              schema: object;
          };
    /**
     * If specified, the system will make a best effort to sample deterministically such that repeated requests with the same seed and parameters should return the same result.
     * Determinism is not guaranteed.
     */
    seed?: number;

    /**
     * A value indicating whether chat completions should be streamed for this request.
     * Default: false
     */
    stream?: boolean;

    /**
     * Whether to include usage information in the response.
     * Requires stream to be set to true.
     */
    stream_options?: {
        /**
         * Whether to include usage information in the response.
         * Default: false
         */
        include_usage?: boolean;
    };

    /**
     * A collection of textual sequences that will end completion generation.
     */
    stop?: string[];

    /**
     * The sampling temperature to use that controls the apparent creativity of generated completions.
     * Higher values will make output more random while lower values will make results more focused and deterministic.
     * It is not recommended to modify temperature and top_p for the same completion request as the interaction of these two settings is difficult to predict.
     * Supported range is [0, 1]. Decimal values are supported.
     */
    temperature?: number;

    /**
     * If specified, the model will configure which of the provided tools it can use for the chat completions response.
     * Can be one of: auto, required, none
     */
    tool_choice?: "auto" | "required" | "none";

    /**
     * A list of tools the model may request to call.
     * Currently, only functions are supported as a tool.
     * The model may respond with a function call request and provide the input arguments in JSON format for that function.
     */
    tools?: {
        /**
         * Value: function
         */
        type: "function";
        function: {
            /**
             * The name of the function to be called.
             */
            name: string;

            /**
             * A description of what the function does.
             * The model will use this description when selecting the function and interpreting its parameters.
             */
            description: string;

            /**
             * The parameters the function accepts, described as a JSON Schema object.
             */
            parameters: string;
        };
    }[];

    /**
     * An alternative to sampling with temperature called nucleus sampling.
     * This value causes the model to consider the results of tokens with the provided probability mass.
     * As an example, a value of 0.15 will cause only the tokens comprising the top 15% of probability mass to be considered.
     * It is not recommended to modify temperature and top_p for the same request as the interaction of these two settings is difficult to predict.
     * Supported range is [0, 1].
     * Decimal values are supported.
     */
    top_p?: number;
}
