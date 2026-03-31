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
    | SimpleUiParametersImg;

function createSimpleUiElementFromParameters(element: SimpleUiParameters): HTMLElement {
    switch (element.type) {
        case "button":
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
        case "br":
            return document.createElement("br");

        case "p":
            const p = document.createElement("p");
            if (element.id) {
                p.id = element.id;
            }
            if (element.text) {
                p.innerText = element.text;
            }
            return p;

        case "textarea":
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

        case "img":
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

        default:
            throw new Error(`Unsupported element type: ${(element as any).type}`);
    }
}

/**
 * A singleton to build a simple UI of basic HTML elements.
 * @beta
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
     * Create a new simpleUi builder.
     *
     * @beta
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
     * @beta
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
     * @param options.id - button id
     * @param options.text - button text
     * @param options.onclick - click event handler
     *
     * @beta
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
     * @param options.id - textarea id
     * @param options.rows - number of rows
     * @param options.cols - number of columns
     *
     * @beta
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
     * @param options.id - paragraph id
     * @param options.text - paragraph text
     *
     * @beta
     */
    public p(options: { id?: string; text?: string }) {
        const p: SimpleUiParametersP = {
            type: "p",
            id: options.id,
            text: options.text,
        };

        return this.#addElement(p);
    }

    /**
     * Add image.
     * @param options.id - image id
     * @param options.src - image source
     * @param options.alt - image alt text
     *
     * @beta
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
     * @beta
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
