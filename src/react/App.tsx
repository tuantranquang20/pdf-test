import React, { useState } from "react";
import MyComponent from "./components/MyComponent";

export default function App() {
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <title>Bun, Elysia & React</title>
                <meta name="description" content="Bun, Elysia & React" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
                <MyComponent></MyComponent>
            </body>
        </html>
    );
}