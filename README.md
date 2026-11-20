# @sharadox/gallery-web-library

Full-screen photo viewing for React: the behavior and the controls, in each site's own design.

```tsx
import { Lightbox } from "@sharadox/gallery-web-library/lightbox";

<Lightbox
  count={photos.length}
  index={open}
  onChange={(index) => setOpen(index)}
  label={photo.alt}
  labels={{ close: "Close", previous: "Previous photo", next: "Next photo" }}
  classNames={styles}
>
  {(index, direction) => (
    <figure className={styles.figure}>
      <img src={photos[index].src} alt="" />
      <figcaption>{photos[index].alt}</figcaption>
    </figure>
  )}
</Lightbox>;
```

| Import       | What it does                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `…/lightbox` | `<Lightbox count index onChange label labels classNames strokes? children>`: closes on a click outside the photo, Escape or the close button; with several photos, the chevrons, a swipe and the arrow keys page through them (wrapping around); the page behind doesn't scroll while it's open. The site draws the photo (`children(index, direction)`, the direction of the last step for slides) and styles the backdrop and controls through `classNames`. To draw it above everything from anywhere, put it in a portal (for example `Portal` from `@sharadox/showcase-web-library`). |

## Develop

`pnpm verify` runs formatting, lint, type-check, tests with 100% coverage and the build. Branches follow `<feature>.development` → `development` → `index`, and releases are `v<version>` tags on `index`.

## License

Licença Sharadox de Código Aberto, versão 0.1.0. See [português](LICENCA.md) (the binding text) and the [English translation](LICENSE.md).
