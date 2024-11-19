## Eslint & Prettier configuration

Instalar las siguientes dependencias como dependencias de desarrollo

```
npm install --save-dev eslint-config-standard
npm install --save-dev eslint-plugin-tailwindcss
npm install --save-dev eslint-config-prettier
npm install --save-dev prettier
```

En el archivo `.eslintrc-json` agregar al array de `"extends"`

```
"standart"
"plugin:tailwindcss/recommended"
"prettier"
```

## Tailwind theming

En el archivo `tailwind.config.ts` en la clave theme se puede configurar el style guide del proyecto

```
theme: {
  extend: {
    colors: {
      brand: {
        DEFAULT: '#fa7275',
        100: '#ea6365'
      }
    },
    fontFamily: {

    },
    boxShadow: {

    },
    borderRadius: {

    },
    keyFrames: {

    },
    animation: {

    },
  }
}
```

Uso: para llegar al DEFAULT de brand `-brand` y para llegar al 100, `-brand-100`

## Tailwind config

`@layer utilities`, crea clases reusables:

```
@layer utilities {
  .layout {
    @apply flex items-center justify-center h-screen bg-amber-100
  }
}
```

```
<div className="layout">
  <h1 className="text-3xl font-bold text-brand">
    StoreIt, The unique store solution that you need.
  </h1>
</div>
```

Lo que será igual a si aplicaramos

```
<div className="flex items-center justify-center h-screen bg-amber-100">
  <h1 className="text-3xl font-bold text-brand">
    StoreIt, The unique store solution that you need.
  </h1>
</div>
```

## Auth Layout

Crear una carpeta `(auth)` para _group routing_ y dentro crear las rutas (mediante folders) `sign-in` y `sign-up` hay que tener en cuenta que (auth) no será tomado en cuenta en la navegación, solo agrupa rutas.

Sin embargo podemos compartir UI creando un archivo `layout.tsx` en `(auth)` que afecten a las rutas bajo esa carpeta.
