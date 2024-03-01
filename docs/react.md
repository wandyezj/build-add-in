# React

Notes on react.

- [react-scripts](#react-scripts)
- [Using React](#using-react)
    - [Root](#root)
    - [Components](#components)
    - [Component Properties](#component-properties)
    - [useState](#usestate)
    - [Other](#other)
- [Convenient Libraries](#convenient-libraries)
    - [Fluent UI](#fluent-ui)


## react-scripts

Don't use it. It bundles a ton of tools together and makes the project fragile and difficult to maintain.

Instead simply use the tools you need as this template does.

## Using React

### Root

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import MyComponent from "./MyComponent";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MyComponent />);
```

### Components

Use function components.

```typescript
// MyComponent.tsx
import React from 'react';

export function MyComponent() {
  return <h2>Component</h2>;
}

```

```typescript
// AnotherComponent.tsx

import React from 'react';
import { MyComponent } from "./MyComponent";

export function AnotherComponent() {
    // Use component
    return <MyComponent />;
}

```

### Component Properties

```typescript
// MyComponent.tsx
import React from 'react';

interface MyComponentProps {
    value: string;
}

// An alternative is `{value}: {value: string}` this avoids the prop interface.
export function MyComponent(props: MyComponentProperties) {
  return <h2>value</h2>;
}

```

```typescript
// AnotherComponent.tsx

import React from 'react';
import { MyComponent } from "./MyComponent";

export function AnotherComponent() {
    // Pass prop value to component
    return <MyComponent value={"Component"} />;
}

```

### useState

```typescript
// MyComponent.tsx
import React from 'react';

interface MyComponentProps {
    value: string;
}

export function AnotherComponent(props: MyComponentProperties) {

  // stateful variable
  const [name, setName] = useState("component");

  // change the name when the component is clicked the first time
  const toggleState = () => {
    if (name === "component") {
        setName("component clicked");
    }
  };

  return <MyComponent onClick={toggleState} value={name}/>;
}

```

### Other

- useEffect
    - Have side effects impact the component.
- context
    - Manage application global state and avoid passing data through components which triggers re-renders.
- useRef
    - Persists values between renders without triggering a re-render.
    - Allow access to underlying html element.
- useReducer
    - Allow custom calculation of state from other state values.
    - This allows avoiding re-renders if overall output state from the reducer has not changed even if the input states have.
- useMemo & useCallback
    - Used to optimize performance by avoiding unnecessary component renders.

### useRef

`useRef` to persist state without triggering a re-render.
This can also be used to record previous state values.

```typescript
export function Component() {
    // count is incremented on every component re-render. However the increment does not trigger a component re-render.
    const count = useRef(0);
    useEffect(() => {
        count.current = count.current + 1;
    });
    return (<p>{count.current}</p>);
}
```

`useRef` to access underlying element.

```typescript

export function Component() {
  // Focus on input when a button is clicked.
  const inputElement = useRef();

  const focusInput = () => {
    // Access to underlying element.
    inputElement.current.focus();
  };

    // Note: ref is set to the reference.
  return (
    <>
      <input type="text" ref={inputElement} />
      <button onClick={focusInput}>Focus Input</button>
    </>
  );
}
```



## Convenient Libraries

### Fluent UI

Library of well styled components designed for accessibility.

[About Fluent 2](https://fluent2.microsoft.design/)

`npm install @fluentui/react-components`
