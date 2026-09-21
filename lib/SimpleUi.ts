import { getHostColor } from "./getHostColor";

interface SimpleUiParametersBr {
    type: "br";
}

interface SimpleUiParametersButton {
    type: "button";
    id?: string;
    text?: string;
    onclick?: () => void;
}

interface SimpleUiParametersP {
    type: "p";
    id?: string;
    text?: string;
    html?: string;
}

interface SimpleUiParametersH {
    type: "h1" | "h2" | "h3" | "h4";
    id?: string;
    text?: string;
    html?: string;
}

interface SimpleUiParametersTextarea {
    type: "textarea";
    id?: string;
    rows?: number;
    cols?: number;
}

interface SimpleUiParametersImg {
    type: "img";
    id?: string;
    src?: string;
    alt?: string;
}

type SimpleUiParameters =
    | SimpleUiParametersButton
    | SimpleUiParametersBr
    | SimpleUiParametersTextarea
    | SimpleUiParametersP
    | SimpleUiParametersH
    | SimpleUiParametersImg;

function createSimpleUiElementFromParameters(element: SimpleUiParameters): HTMLElement {
    const elementType = element.type;
    switch (elementType) {
        case "button": {
            const button = document.createElement("button");
            if (element.id) {
                button.id = element.id;
            }
            if (element.text) {
                button.innerText = element.text;
            }
            if (element.onclick) {
                button.addEventListener("click", element.onclick);
            }
            return button;
        }
        case "br":
            return document.createElement("br");

        case "p": {
            const p = document.createElement("p");
            if (element.id) {
                p.id = element.id;
            }
            if (element.text) {
                p.innerText = element.text;
            }
            if (element.html) {
                p.innerHTML = element.html;
            }
            return p;
        }

        case "h1":
        case "h2":
        case "h3":
        case "h4": {
            const h = document.createElement(elementType);
            if (element.id) {
                h.id = element.id;
            }
            if (element.text) {
                h.innerText = element.text;
            }
            if (element.html) {
                h.innerHTML = element.html;
            }
            return h;
        }

        case "textarea": {
            const textarea = document.createElement("textarea");
            if (element.id) {
                textarea.id = element.id;
            }
            if (element.rows !== undefined) {
                textarea.rows = element.rows;
            }
            if (element.cols !== undefined) {
                textarea.cols = element.cols;
            }
            return textarea;
        }

        case "img": {
            const img = document.createElement("img");
            if (element.id) {
                img.id = element.id;
            }
            if (element.src) {
                img.src = element.src;
            }
            if (element.alt) {
                img.alt = element.alt;
            }
            return img;
        }

        default:
            throw new Error(`Unsupported element type: ${elementType}`);
    }
}

class SimpleUiWrapperElement<T extends HTMLElement> {
    #id: string;
    #type: "img" | "textarea";

    constructor(type: "img" | "textarea", id: string) {
        this.#type = type;
        this.#id = id;
    }

    protected get element(): T {
        const element = document.getElementById(this.#id) as T | null;
        if (element === null || element.tagName.toLowerCase() !== this.#type) {
            throw new Error(`Element ${this.#type} with id ${this.#id} not found.`);
        }
        return element;
    }
}

/**
 * @public
 */
export interface SimpleUiImg {
    /**
     * Sets the image src from a base64 string.
     * @param base64 - the base64 string representing the image data
     */
    setSrcFromBase64(base64: string): void;
}

class SimpleUiWrapperImg extends SimpleUiWrapperElement<HTMLImageElement> implements SimpleUiImg {
    constructor(id: string) {
        super("img", id);
    }

    setSrcFromBase64(base64: string) {
        super.element.src = `data:image/png;base64,${base64}`;
    }
}

/**
 * @public
 */
export interface SimpleUiTextarea {
    /**
     * Gets and sets the value of the textarea.
     * @param value - the value to set for the textarea
     */
    value: string;
}

class SimpleUiWrapperTextarea extends SimpleUiWrapperElement<HTMLTextAreaElement> implements SimpleUiTextarea {
    constructor(id: string) {
        super("textarea", id);
    }

    get value(): string {
        return super.element.value;
    }

    set value(value: string) {
        super.element.value = value;
    }
}

/**
 * @public
 */
export type SimpleUiElementIds<T extends Record<string, readonly string[]>> = {
    readonly [K in keyof T]: {
        readonly [SubK in T[K][number]]: `${K & string}-${SubK & string}`;
    };
};

function createIds<const T extends Record<string, readonly string[]>>(config: T): SimpleUiElementIds<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: Record<string, any> = {};

    for (const key of Object.keys(config)) {
        result[key] = {};
        for (const subKey of config[key]) {
            result[key][subKey] = `${key}-${subKey}`;
        }
    }

    return result as SimpleUiElementIds<T>;
}

/**
 * A singleton to build a simple UI of basic HTML elements.
 * @public
 */
export class SimpleUi {
    #elements: SimpleUiParameters[] = [];

    #addElement(element: SimpleUiParameters) {
        if (this.#built) {
            throw new Error("Cannot add elements after build");
        }

        this.#elements.push(element);
        return this;
    }

    #built: boolean = false;

    private constructor() {}

    static singleton: SimpleUi | undefined = undefined;

    /**
     * Get a span element as a string containing the host and platform information. Apply to html.
     * @public
     * @param host - the host name
     * @param platform - the platform name
     * @returns a span element as a string containing the host and platform information
     */
    static spanHostPlatform(host: string, platform: string): string {
        const hostColor = getHostColor(host);
        return `<span><span style="color: ${hostColor}">${host}</span> on ${platform}</span>`;
    }

    /**
     * @public
     */
    static img(id: string): SimpleUiImg {
        return new SimpleUiWrapperImg(id);
    }

    /**
     * @public
     */
    static textarea(id: string): SimpleUiTextarea {
        return new SimpleUiWrapperTextarea(id);
    }

    /**
     * Creates a SimpleUiElementIds object from provided configuration.
     *
     * @example
     * ```ts
     * const id = createIds({
     *   img: ["chart"],
     *   p: ["description", "title"]
     * });
     *
     * // returns:
     * //{ img: { chart: "img-chart" }, p: { description: "p-description", title: "p-title" } }
     * ```
     * @public
     */
    static createIds<const T extends Record<string, readonly string[]>>(config: T): SimpleUiElementIds<T> {
        return createIds(config);
    }

    /**
     * Create a new simpleUi builder.
     *
     * @public
     */
    public static create(): SimpleUi {
        if (SimpleUi.singleton === undefined) {
            SimpleUi.singleton = new SimpleUi();
        }
        return SimpleUi.singleton;
    }

    /**
     * Add br.
     *
     * @public
     */
    public br() {
        const br: SimpleUiParametersBr = {
            type: "br",
        };
        this.#elements.push(br);
        return this;
    }

    /**
     * Add button.
     * @param options - The button configuration:
     *   - `id`: Button element ID.
     *   - `text`: Button text.
     *   - `onclick`: Click handler.
     *
     * @public
     */
    public button(options: { id?: string; text?: string; onclick?: () => void } = {}) {
        const button: SimpleUiParametersButton = {
            type: "button",
            id: options.id,
            text: options.text,
            onclick: options.onclick,
        };

        return this.#addElement(button);
    }

    /**
     * Add textarea.
     * @param options - The textarea configuration:
     *   - `id`: Textarea element ID.
     *   - `rows`: Number of rows.
     *   - `cols`: Number of columns.
     *
     * @public
     */
    public textarea(options: { id?: string; rows?: number; cols?: number }) {
        const textarea: SimpleUiParametersTextarea = {
            type: "textarea",
            id: options.id,
            rows: options.rows,
            cols: options.cols,
        };

        return this.#addElement(textarea);
    }

    /**
     * Add paragraph.
     * @param options - The paragraph configuration:
     *   - `id`: Paragraph element ID.
     *   - `text`: Paragraph text.
     *   - `html`: Paragraph HTML content.
     *
     * @public
     */
    public p(options: { id?: string; text?: string; html?: string }) {
        const p: SimpleUiParametersP = {
            type: "p",
            id: options.id,
            text: options.text,
            html: options.html,
        };

        return this.#addElement(p);
    }

    #h(level: "h1" | "h2" | "h3" | "h4", options: { id?: string; text?: string; html?: string }) {
        const h: SimpleUiParametersH = {
            type: level,
            id: options.id,
            text: options.text,
            html: options.html,
        };

        return this.#addElement(h);
    }

    /**
     * Add heading level 1.
     * @param options - The heading configuration:
     *   - `id`: Heading element ID.
     *   - `text`: Heading text.
     *   - `html`: Heading HTML content.
     *
     * @public
     */
    public h1(options: { id?: string; text?: string; html?: string }) {
        return this.#h("h1", options);
    }

    /**
     * Add heading level 2.
     * @param options - The heading configuration:
     *   - `id`: Heading element ID.
     *   - `text`: Heading text.
     *   - `html`: Heading HTML content.
     *
     * @public
     */
    public h2(options: { id?: string; text?: string; html?: string }) {
        return this.#h("h2", options);
    }

    /**
     * Add heading level 3.
     * @param options - The heading configuration:
     *   - `id`: Heading element ID.
     *   - `text`: Heading text.
     *   - `html`: Heading HTML content.
     *
     * @public
     */
    public h3(options: { id?: string; text?: string; html?: string }) {
        return this.#h("h3", options);
    }

    /**
     * Add heading level 4.
     * @param options - The heading configuration:
     *   - `id`: Heading element ID.
     *   - `text`: Heading text.
     *   - `html`: Heading HTML content.
     *
     * @public
     */
    public h4(options: { id?: string; text?: string; html?: string }) {
        return this.#h("h4", options);
    }

    /**
     * Add image.
     * @param options - The image configuration:
     *   - `id`: Image element ID.
     *   - `src`: Image source.
     *   - `alt`: Alternative text.
     *
     * @public
     */
    public img(options: { id?: string; src?: string; alt?: string } = {}) {
        const img: SimpleUiParametersImg = {
            type: "img",
            id: options.id,
            src: options.src,
            alt: options.alt,
        };

        return this.#addElement(img);
    }

    /**
     * Instantiate and append the simple UI elements to the provided div.
     * @param id The id of the div to append the elements to.
     *
     * @public
     */
    public buildOnDiv(id: string) {
        const div = document.getElementById(id);
        if (div === null) {
            throw new Error(`Div with id "${id}" not found`);
        }

        const elements = this.#elements.map((elementParameters) =>
            createSimpleUiElementFromParameters(elementParameters)
        );
        div.append(...elements);
        this.#built = true;
    }
}
